export function renderResultsTable(containerId, result) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (result.error) {
    container.innerHTML = `
      <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239,68,68,0.3); border-radius: var(--radius-md); padding: 1rem; color: var(--error);">
        <h4 style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          SQL Error
        </h4>
        <p style="font-family: var(--font-mono); white-space: pre-wrap; font-size: 0.85rem; opacity: 0.9;">${result.error}</p>
      </div>
    `;
    return;
  }

  if (!result.columns || result.columns.length === 0 || !result.rows || result.rows.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-secondary); padding: 2rem;">
        <p>Query returned 0 rows.</p>
      </div>
    `;
    return;
  }

  const thead = `
    <thead>
      <tr style="border-bottom: 1px solid var(--border-color);">
        ${result.columns.map(col => `<th style="padding: 0.6rem 0.75rem; text-align: left; font-weight: 600; font-size: 0.72rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap;">${col}</th>`).join('')}
      </tr>
    </thead>
  `;

  const tbody = `
    <tbody>
      ${result.rawRows.map((row, idx) => `
        <tr style="border-bottom: 1px solid var(--border-color); background: ${idx % 2 === 0 ? 'transparent' : 'var(--bg-elevated)'};">
          ${row.map(cell => `<td style="padding: 0.6rem 0.75rem; font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-primary); white-space: nowrap;">${cell !== null ? cell : '<span style="color: var(--text-secondary); font-style: italic;">NULL</span>'}</td>`).join('')}
        </tr>
      `).join('')}
    </tbody>
  `;

  container.innerHTML = `
    <div style="width: 100%; overflow-x: auto; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
      <table style="width: 100%; min-width: 100%; border-collapse: collapse; text-align: left; table-layout: auto;">
        ${thead}
        ${tbody}
      </table>
    </div>
    <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-secondary);">
      ${result.rows.length} row${result.rows.length !== 1 ? 's' : ''} returned
    </div>
  `;
}
