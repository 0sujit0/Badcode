export function renderResultsTable(containerId, result, validation = null, executionTimeMs = '0.8ms') {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Helper to update the status dot + text in the results toolbar
  function updateStatus(state, text = '') {
    const dot = document.getElementById('results-status-dot');
    const label = document.getElementById('results-status-text');
    if (dot) {
      dot.className = 'status-dot' + (state !== 'waiting' ? ` ${state}` : '');
    }
    if (label) {
      label.textContent = text || (state === 'waiting' ? 'Waiting' : state === 'success' ? 'Ready' : 'Error');
      label.style.color = state === 'success' ? 'var(--success)' : state === 'error' ? 'var(--error)' : 'var(--text-muted)';
    }
  }

  // Empty State (no result yet)
  if (!result) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem 1rem; color: var(--text-muted); text-align: center;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 1rem; opacity: 0.3;"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>
        <p style="font-size: 0.9rem; margin-bottom: 0.5rem; color: var(--text-secondary);">Run a query to see results</p>
        <p style="font-size: 0.75rem; font-family: var(--font-mono); opacity: 0.5;">Press ⌘ + Enter</p>
      </div>
    `;
    updateStatus('waiting', 'Waiting');
    return;
  }

  // Error State
  if (result.error) {
    // Generate a smart suggestion if possible
    const errorMsg = result.error || '';
    let suggestion = '';
    const tableMatch = errorMsg.match(/no such table:\s*(\w+)/i);
    if (tableMatch) {
      const attempted = tableMatch[1];
      suggestion = `💡 Did you mean <code>${attempted.charAt(0).toUpperCase() + attempted.slice(1)}s</code>? Table names are case-sensitive.`;
    } else if (errorMsg.toLowerCase().includes('syntax')) {
      suggestion = `💡 Check your SQL syntax. Common mistakes: missing commas, unclosed quotes, or wrong keyword order.`;
    } else {
      suggestion = `💡 Double-check your table and column names — they are case-sensitive.`;
    }

    container.innerHTML = `
      <div style="border-radius: var(--radius-md); overflow: hidden;">
        <div class="error-banner">
          <div class="error-x">✕</div>
          Query Error
        </div>
        <div class="error-body">
          ${errorMsg}
          <div class="error-suggestion">${suggestion}</div>
        </div>
      </div>
    `;
    updateStatus('error', 'Error');
    return;
  }

  // Zero rows returned
  if (!result.columns || result.columns.length === 0 || !result.rows || result.rows.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-secondary); padding: 2rem; border-top: 1px dashed var(--border);">
        <p>Query ran successfully, but returned 0 rows.</p>
      </div>
    `;
    updateStatus('success', '0 rows');
    return;
  }

  const rowCount = result.rows.length;
  const rowText = `${rowCount} row${rowCount !== 1 ? 's' : ''}`;

  // Banners based on validation
  let bannerHtml = '';
  let statusState = 'waiting';
  let statusText = '';

  if (validation) {
    if (validation.verdict === 'correct') {
      bannerHtml = `
        <div class="success-banner">
          <div class="success-check">✓</div>
          Correct — ${rowText} returned
          <span class="success-meta">${executionTimeMs}</span>
        </div>
      `;
      statusState = 'success';
      statusText = `${rowText} · ${executionTimeMs}`;
    } else if (validation.verdict === 'partial') {
      const partialMessages = {
        wrong_columns: 'Right table, but wrong columns.',
        wrong_row_count: `Returned ${validation.got} row(s) — expected ${validation.expected}.`,
        wrong_order: 'Right rows, wrong order. Check ORDER BY.',
        wrong_values: "The values returned don't match the expected output."
      };
      bannerHtml = `
        <div class="partial-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          Partial: ${partialMessages[validation.reason] || 'Almost there.'}
        </div>
      `;
      statusState = 'error';
      statusText = 'Almost';
    } else {
      bannerHtml = `
        <div class="error-banner">
          <div class="error-x">✕</div>
          Results don't match the expected output.
        </div>
      `;
      statusState = 'error';
      statusText = 'Wrong result';
    }
  } else {
    statusState = 'success';
    statusText = rowText;
  }

  const isCorrect = validation && validation.verdict === 'correct';
  
  const thead = `
    <thead>
      <tr>
        ${result.columns.map(col => `<th>${col}</th>`).join('')}
      </tr>
    </thead>
  `;

  const tbody = `
    <tbody>
      ${result.rawRows.map(row => `
        <tr>
          ${row.map(cell => `<td>${cell !== null ? String(cell) : '<span style="color: var(--text-muted); font-style: italic;">NULL</span>'}</td>`).join('')}
        </tr>
      `).join('')}
    </tbody>
  `;

  container.innerHTML = `
    ${bannerHtml}
    <div style="width: 100%; overflow-x: auto;">
      <table class="results-table">
        ${thead}
        ${tbody}
      </table>
    </div>
  `;

  updateStatus(statusState, statusText);
}
