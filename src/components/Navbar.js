import problems from '../data/problems.json';

const levelTitleMap = {
  1: "First Steps",
  2: "SELECT Basics",
  3: "Filtering & Sorting",
  4: "Aggregations",
  5: "JOINs",
  6: "Modifying Data",
  7: "Text & Dates",
  8: "Window Functions"
};

export default function Navbar() {
  const hash = window.location.hash || '#/';
  let breadcrumbHtml = '';

  if (hash.startsWith('#/lesson/')) {
    const lessonId = hash.split('/').pop();
    const problem = problems.find(p => p.id === lessonId);
    if (problem) {
      const levelTitle = levelTitleMap[problem.level] || `Level ${problem.level}`;
      const levelStr = `Level ${problem.level} — ${levelTitle}`;
      
      const levelProblems = problems.filter(p => p.level === problem.level).sort((a, b) => a.id.localeCompare(b.id));
      const currentIndex = levelProblems.findIndex(p => p.id === problem.id);
      const problemNumber = currentIndex + 1;

      breadcrumbHtml = `
        <div class="breadcrumb-nav" style="margin-left: 1.5rem;">
          <a href="#/dashboard" class="breadcrumb-item">Modules</a>
          <span class="breadcrumb-separator">›</span>
          <a href="#/level/${problem.level}" class="breadcrumb-item">${levelStr}</a>
          <span class="breadcrumb-separator">›</span>
          <span class="breadcrumb-current">Problem ${problemNumber}</span>
        </div>
      `;
    }
  } else if (hash.startsWith('#/level/')) {
    const lvl = parseInt(hash.split('/').pop(), 10);
    if (lvl) {
      const levelTitle = levelTitleMap[lvl] || `Level ${lvl}`;
      const levelStr = `Level ${lvl} — ${levelTitle}`;
      
      breadcrumbHtml = `
        <div class="breadcrumb-nav" style="margin-left: 1.5rem;">
          <a href="#/dashboard" class="breadcrumb-item">Modules</a>
          <span class="breadcrumb-separator">›</span>
          <span class="breadcrumb-current">${levelStr}</span>
        </div>
      `;
    }
  } else if (hash.startsWith('#/dashboard')) {
    breadcrumbHtml = `
      <div class="breadcrumb-nav" style="margin-left: 1.5rem;">
        <span class="breadcrumb-current">Modules</span>
      </div>
    `;
  }

  return `
    <nav class="navbar" style="padding: 0.85rem 2rem;">
      <!-- Brand & Breadcrumbs -->
      <div class="flex items-center">
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
        ${breadcrumbHtml}
      </div>

      <!-- Right side actions -->
      <div class="flex items-center" style="gap: 0.75rem; z-index: 10;">
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

        <button id="theme-toggle-btn" title="Toggle light / dark mode" style="
          width: 32px; height: 32px;
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
          <span id="theme-icon" style="font-size: 14px; line-height: 1;">🌙</span>
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
    
    // Dispatch event if other components need to know
    window.dispatchEvent(new CustomEvent('badcode:themechange', { detail: { theme } }));
  }

  // Sync icon with current theme on mount
  const current = document.documentElement.getAttribute('data-theme') || (localStorage.getItem('bdc-theme') || 'light');
  document.documentElement.setAttribute('data-theme', current);
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
