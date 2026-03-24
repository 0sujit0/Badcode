export function renderHintPanel(containerId, problem, failedAttempts, onShowAnswer) {
  const container = document.getElementById(containerId);
  if (!container || !problem) return;

  const hintLevel = Math.min(failedAttempts, 3);
  const prevHintLevel = parseInt(container.dataset.hintLevel ?? '-1');
  container.dataset.hintLevel = hintLevel;

  const newlyUnlocked = (n) => hintLevel >= n && prevHintLevel < n;
  const animStyle = 'animation: fadeIn 0.5s forwards; opacity: 0;';

  // Hint 1 — always visible, revealed
  const hint1Html = `
    <div class="hint-card revealed" ${newlyUnlocked(0) ? `style="${animStyle}"` : ''}>
      <span class="hint-number">Hint 1</span>
      ${problem.hints[0]}
    </div>
  `;

  // Hint 2
  let hint2Html = '';
  if (hintLevel >= 1) {
    hint2Html = `
      <div class="hint-card revealed" ${newlyUnlocked(1) ? `style="${animStyle}"` : ''}>
        <span class="hint-number">Hint 2</span>
        ${problem.hints[1]}
      </div>
    `;
  } else {
    hint2Html = `
      <div class="hint-card locked">
        <span class="lock-icon">🔒</span>
        Give it a try to unlock Hint 2
      </div>
    `;
  }

  // Hint 3
  let hint3Html = '';
  if (hintLevel >= 2) {
    hint3Html = `
      <div class="hint-card revealed" style="${newlyUnlocked(2) ? animStyle : ''}border-color: var(--success-border); background: var(--success-tint);">
        <span class="hint-number" style="color: var(--success);">Hint 3 — Answer</span>
        ${problem.hints[2]}
      </div>
    `;
  } else {
    hint3Html = `
      <div class="hint-card locked">
        <span class="lock-icon">🔒</span>
        One more try unlocks Hint 3
      </div>
    `;
  }

  // Show Answer button
  let showAnswerHtml = '';
  if (hintLevel >= 3) {
    showAnswerHtml = `
      <button id="show-answer-btn" class="btn btn-dark mt-4" style="width: 100%; justify-content: center; font-size: 0.9rem; padding: 0.6rem;">Show Answer in Editor</button>
    `;
  }

  container.innerHTML = `
    <div class="hints-section">
      <div class="hints-label">
        💡 Hints
      </div>
      ${hint1Html}
      ${hint2Html}
      ${hint3Html}
      ${showAnswerHtml}
    </div>
    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    </style>
  `;

  if (hintLevel >= 3) {
    const btn = document.getElementById('show-answer-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        if (onShowAnswer) onShowAnswer(problem.hints[2]);
      });
    }
  }
}
