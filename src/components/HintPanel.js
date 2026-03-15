export function renderHintPanel(containerId, problem, failedAttempts, onShowAnswer) {
  const container = document.getElementById(containerId);
  if (!container || !problem) return;

  const hintLevel = Math.min(failedAttempts, 3);
  let html = `
    <div style="background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1rem; margin-top: 1rem;">
      <h4 style="margin-bottom: 1rem; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        Need a hint?
      </h4>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <div style="font-size: 0.9rem; padding: 0.75rem; background: var(--bg-card); color: var(--text-primary); border-radius: var(--radius-md); border-left: 3px solid var(--accent);">
          <strong>Hint 1:</strong> ${problem.hints[0]}
        </div>
  `;

  if (hintLevel >= 1) {
    html += `
        <div style="font-size: 0.9rem; padding: 0.75rem; background: var(--bg-card); color: var(--text-primary); border-radius: var(--radius-md); border-left: 3px solid var(--accent); opacity: 0; animation: fadeIn 0.5s forwards;">
          <strong>Hint 2:</strong> ${problem.hints[1]}
        </div>
    `;
  } else {
    html += `
        <div style="font-size: 0.85rem; padding: 0.75rem; color: var(--text-muted); border: 1px dashed var(--border); border-radius: var(--radius-md); text-align: center;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.25rem; vertical-align: middle;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Hint 2 unlocks after 1 failed attempt
        </div>
    `;
  }

  if (hintLevel >= 2) {
     html += `
      <div style="font-size: 0.9rem; padding: 0.75rem; background: var(--bg-card); color: var(--text-primary); border-radius: var(--radius-md); border-left: 3px solid var(--success); opacity: 0; animation: fadeIn 0.5s forwards;">
        <strong>Hint 3:</strong> ${problem.hints[2]}
      </div>
    `;
  } else {
    html += `
      <div style="font-size: 0.85rem; padding: 0.75rem; color: var(--text-muted); border: 1px dashed var(--border); border-radius: var(--radius-md); text-align: center;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.25rem; vertical-align: middle;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        Hint 3 unlocks after 2 failed attempts
      </div>
    `;
  }

  if (hintLevel >= 3) {
    html += `
      <button id="show-answer-btn" class="btn btn-dark mt-4" style="width: 100%; justify-content: center;">Show Answer</button>
    `;
  }

  html += `
      </div>
    </div>
    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    </style>
  `;

  container.innerHTML = html;

  if (hintLevel >= 3) {
    const btn = document.getElementById('show-answer-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        if (onShowAnswer) onShowAnswer(problem.hints[2]);
      });
    }
  }
}
