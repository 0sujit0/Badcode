export default function Navbar() {
  return `
    <nav class="navbar" style="padding: 0.85rem 2rem;">
      <!-- Brand -->
      <a href="#/" class="nav-brand flex items-center gap-2" style="text-decoration: none; z-index: 10; gap: 0.5rem; display: flex; align-items: center;">
        <div style="
          width: 22px; height: 22px; border-radius: 50%;
          background: var(--accent);
          color: var(--text-inverse);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-mono); font-size: 0.8rem; font-weight: 800;
        ">*</div>
        <span style="
          font-family: var(--font-mono);
          color: var(--text-primary);
          font-size: 1rem; font-weight: 700;
          letter-spacing: -0.04em;
        ">badcode</span>
      </a>

      <!-- Center nav links -->
      <div class="nav-center" style="
        position: absolute; left: 50%; transform: translateX(-50%);
        display: flex; gap: 0.25rem;
      ">
        <a href="#/dashboard" style="
          text-decoration: none;
          color: var(--text-secondary);
          font-size: 0.85rem; font-weight: 500;
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          transition: color 0.15s, background 0.15s;
        " onmouseenter="this.style.color='var(--text-primary)';this.style.background='var(--bg-elevated)'"
           onmouseleave="this.style.color='var(--text-secondary)';this.style.background='transparent'">
          Modules
        </a>
        <a href="#/" style="
          text-decoration: none;
          color: var(--text-secondary);
          font-size: 0.85rem; font-weight: 500;
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          transition: color 0.15s, background 0.15s;
        " onmouseenter="this.style.color='var(--text-primary)';this.style.background='var(--bg-elevated)'"
           onmouseleave="this.style.color='var(--text-secondary)';this.style.background='transparent'">
          Practice
        </a>
      </div>

      <!-- Right side actions -->
      <div class="flex items-center" style="gap: 0.75rem; z-index: 10;">
        <button id="cheatsheet-btn" style="
          background: transparent;
          border: 1px solid var(--border-hover);
          color: var(--text-secondary);
          font-family: var(--font-sans);
          font-size: 0.8rem; font-weight: 600;
          padding: 0.35rem 0.9rem;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        " onmouseenter="this.style.borderColor='var(--accent)';this.style.color='var(--text-primary)'"
           onmouseleave="this.style.borderColor='var(--border-hover)';this.style.color='var(--text-secondary)'">
          Cheat Sheet
        </button>

        <div id="ai-toggle-container" class="flex items-center" style="
          gap: 0.5rem; cursor: pointer;
          background: var(--bg-elevated);
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border);
          transition: border-color 0.15s;
        " onmouseenter="this.style.borderColor='var(--border-hover)'"
           onmouseleave="this.style.borderColor='var(--border)'">
          <span style="font-size: 0.8rem; font-weight: 500; color: var(--text-secondary); user-select: none;">AI Coach</span>
          <div id="ai-toggle-switch" style="
            width: 30px; height: 16px;
            background: var(--border);
            border-radius: 8px; position: relative;
            transition: background 0.25s;
          ">
            <div id="ai-toggle-knob" style="
              width: 12px; height: 12px;
              background: var(--text-muted);
              border-radius: 50%;
              position: absolute; top: 2px; left: 2px;
              transition: transform 0.25s, background 0.25s;
            "></div>
          </div>
        </div>

        <!-- Theme Toggle -->
        <button id="theme-toggle-btn" title="Toggle light / dark mode" style="
          width: 34px; height: 34px;
          border-radius: 50%;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          flex-shrink: 0;
        " onmouseenter="this.style.borderColor='var(--border-hover)';this.style.color='var(--text-primary)'"
           onmouseleave="this.style.borderColor='var(--border)';this.style.color='var(--text-secondary)'">
          <span id="theme-icon" style="font-size: 15px; line-height: 1;">🌙</span>
        </button>

        <button id="auth-btn" style="
          background: var(--accent);
          color: var(--text-inverse);
          font-family: var(--font-sans);
          font-size: 0.8rem; font-weight: 700;
          padding: 0.4rem 1.1rem;
          border-radius: var(--radius-full);
          border: none; cursor: pointer;
          transition: background 0.15s;
        " onmouseenter="this.style.background='var(--accent-yellow-hover)'"
           onmouseleave="this.style.background='var(--accent)'">
          Sign In
        </button>
      </div>
    </nav>
  `;
}

export function bindNavbar() {
  import('../auth/authUI.js').then(({ initAuthUI }) => initAuthUI());
  import('../ai/aiToggle.js').then(({ initAIToggle }) => initAIToggle());
  import('./CheatSheet.js').then(({ toggleCheatSheet }) => {
    const btn = document.getElementById('cheatsheet-btn');
    if (btn) btn.onclick = toggleCheatSheet;
  });

  // ── Theme toggle ──────────────────────────────────────────────────
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bdc-theme', theme);
    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  // Sync icon with current theme on mount
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = current === 'dark' ? '☀️' : '🌙';

  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    btn.onclick = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      applyTheme(isDark ? 'light' : 'dark');
    };
  }
}
