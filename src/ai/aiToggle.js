let aiEnabled = false;

export function initAIToggle() {
  const container = document.getElementById('ai-toggle-container');
  const switchBg = document.getElementById('ai-toggle-switch');
  const knob = document.getElementById('ai-toggle-knob');
  
  const apiKey = import.meta.env.VITE_AI_API_KEY;
  
  if (!apiKey) {
    container.style.opacity = '0.5';
    container.title = "AI coaching requires VITE_AI_API_KEY in .env";
    container.style.cursor = 'not-allowed';
    return;
  }
  
  container.title = "Toggle AI Coach support";
  
  container.addEventListener('click', () => {
    aiEnabled = !aiEnabled;
    if (aiEnabled) {
      switchBg.style.background = 'var(--success)';
      knob.style.transform = 'translateX(14px)';
    } else {
      switchBg.style.background = 'var(--border-color)';
      knob.style.transform = 'translateX(0)';
    }
  });
}

export function isAIEnabled() {
  return aiEnabled;
}
