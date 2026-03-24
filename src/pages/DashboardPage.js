import { getAllLevelsProgress, isLevelUnlocked, getMode, setMode, getProblemStatus } from '../store/progress.js';
import problems from '../data/problems.json';

const LEVEL_NAMES = {
  1: 'The SELECT Statement',
  2: 'The WHERE Clause',
  3: 'Sorting & Limiting',
  4: 'Grouping & Aggregation',
  5: 'Multiple Tables',
  6: 'Handling NULL Values',
  7: 'Database Mutations (DML)',
  8: 'Functions & Formatting',
  9: 'Complex Logic',
  10: 'Subqueries & Windows'
};

const LEVEL_DIFFS = {
  1: { label: 'Beginner',     varColor: 'var(--accent)' },
  2: { label: 'Beginner',     varColor: 'var(--accent)' },
  3: { label: 'Beginner',     varColor: 'var(--accent)' },
  4: { label: 'Intermediate', varColor: 'var(--warning)' },
  5: { label: 'Intermediate', varColor: 'var(--warning)' },
  6: { label: 'Intermediate', varColor: 'var(--warning)' },
  7: { label: 'Intermediate', varColor: 'var(--warning)' },
  8: { label: 'Intermediate', varColor: 'var(--warning)' },
  9: { label: 'Advanced',     varColor: 'var(--error)' },
  10: { label: 'Advanced',    varColor: 'var(--error)' }
};

const LEVEL_SKILLS = {
  1: ['SELECT', 'DISTINCT', 'ALIASES', 'CONCAT'],
  2: ['WHERE', 'AND', 'OR', 'LIKE', 'NOT'],
  3: ['ORDER BY', 'LIMIT', 'OFFSET', 'IN', 'BETWEEN'],
  4: ['COUNT', 'SUM', 'AVG', 'GROUP BY', 'HAVING'],
  5: ['INNER JOIN', 'LEFT JOIN', 'SELF JOIN'],
  6: ['COALESCE', 'IS NOT NULL', 'NULL MATH'],
  7: ['INSERT', 'UPDATE', 'DELETE'],
  8: ['SUBSTR', 'UPPER', 'REPLACE', 'CAST'],
  9: ['CASE WHEN', 'UNION', 'UNION ALL'],
  10: ['WINDOW', 'CTEs', 'SUBQUERIES']
};

export default function DashboardPage() {
  const levelsData = getAllLevelsProgress(problems);
  const allLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const currentMode = getMode();

  // Bind mode toggle after render
  setTimeout(() => {
    document.getElementById('mode-gated')?.addEventListener('click', () => {
      setMode('gated');
      window.dispatchEvent(new CustomEvent('badcode:rerender'));
    });
    document.getElementById('mode-explore')?.addEventListener('click', () => {
      setMode('explore');
      window.dispatchEvent(new CustomEvent('badcode:rerender'));
    });
  }, 0);

  // Overall stats
  const totalProblems = problems.length;
  const totalSolved = Object.values(levelsData).reduce((sum, d) => sum + d.completed, 0);

  let modulesInProgress = 0;
  let modulesRemaining = 0;
  for (const level of allLevels) {
    const d = levelsData[level] || { total: 0, completed: 0 };
    if (d.completed > 0 && d.completed < d.total) modulesInProgress++;
    if (d.completed < d.total) modulesRemaining++;
  }

  // Find continue target: specific problem
  let continueLevelId = null;
  let continueProblem = null;
  for (const level of allLevels) {
    const levelProblems = problems.filter(p => p.level === level).sort((a, b) => a.id.localeCompare(b.id));
    const firstIncomplete = levelProblems.find(p => !getProblemStatus(p.id).completed);
    if (firstIncomplete) {
      continueLevelId = level;
      continueProblem = firstIncomplete;
      break;
    }
  }
  if (!continueLevelId) continueLevelId = 10;

  const continueLevelData = levelsData[continueLevelId] || { total: 0, completed: 0 };
  const continueProgressPct = continueLevelData.total > 0
    ? Math.round((continueLevelData.completed / continueLevelData.total) * 100) : 0;
  const continueHref = continueProblem ? `#/lesson/${continueProblem.id}` : `#/level/${continueLevelId}`;
  
  // NEW design title/subtext
  const continueTitleText = continueProblem
    ? continueProblem.title
    : LEVEL_NAMES[continueLevelId];
  const continueSubText = continueProblem
    ? (totalSolved === 0 ? "Start your first challenge today." : "Challenge " + (problems.filter(p => p.level === continueLevelId && p.id < continueProblem.id).length + 1) + " of " + problems.filter(p => p.level === continueLevelId).length + " — you were so close last time.")
    : `${continueLevelData.completed} / ${continueLevelData.total} missions complete`;

  // Module cards
  const levelCards = allLevels.map((level, idx) => {
    const data = levelsData[level] || { total: 0, completed: 0 };
    const diff = LEVEL_DIFFS[level];
    const progressPct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
    const levelLocked = currentMode === 'gated' && !isLevelUnlocked(level, problems);

    const isInProgress = !levelLocked && data.completed > 0 && data.completed < data.total;
    const isComplete = !levelLocked && data.total > 0 && data.completed === data.total;

    let stateClass = 'mc-not-started';
    let badgeHtml = '';

    if (levelLocked) {
      stateClass = 'mc-locked';
      badgeHtml = `<span class="mc-badge mc-badge-locked">
        <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        ${diff.label}
      </span>`;
    } else if (isComplete) {
      stateClass = 'mc-complete';
      badgeHtml = `<span class="mc-badge mc-badge-done">&#x2713; Complete</span>`;
    } else if (isInProgress) {
      stateClass = 'mc-in-progress';
      badgeHtml = `<span class="mc-badge mc-badge-progress">In Progress</span>`;
    } else {
      badgeHtml = `<span class="mc-badge mc-badge-idle">Not Started</span>`;
    }

    const maxVisible = 3;
    const skills = LEVEL_SKILLS[level] || [];
    const visibleSkills = skills.slice(0, maxVisible);
    const overflow = skills.length - maxVisible;
    const skillTags = visibleSkills.map(s => `<span class="mc-skill">${s}</span>`).join('') + 
                      (overflow > 0 ? `<span class="mc-skill overflow">+${overflow}</span>` : '');

    const dotCount = level <= 3 ? 1 : level <= 6 ? 2 : 3;
    const dots = [1, 2, 3].map(n =>
      `<span class="mc-dot ${n <= dotCount ? (isComplete ? 'filled-success' : 'filled') : ''}"></span>`
    ).join('');

    const hoverEvents = !levelLocked ? `
      onmouseenter="this.classList.add('mc-hovered')"
      onmouseleave="this.classList.remove('mc-hovered')"
    ` : '';

    return `
      <div
        class="module-card ${stateClass}"
        style="animation-delay: ${idx * 70}ms;"
        ${!levelLocked ? `onclick="window.location.hash='#/level/${level}'"` : ''}
        ${hoverEvents}
      >
        <div class="card-inner">
          ${isInProgress ? '<div class="mc-stripe"></div>' : ''}
          <div class="mc-top">
            <div class="mc-num">${String(level).padStart(2, '0')}</div>
            ${badgeHtml}
          </div>
          <div class="mc-title">${LEVEL_NAMES[level]}</div>
          <div class="mc-skills">${skillTags}</div>
          <div class="mc-footer">
            <div class="mc-prog-bar">
              <div class="mc-prog-fill ${isComplete ? 'complete-fill' : ''}" style="width:${progressPct}%"></div>
            </div>
            <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
              <div class="mc-diff-dots">${dots}</div>
              <span class="mc-prog-text">${data.completed}/${data.total}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <style>
      /* ─── Dashboard Redesign ─── */
      .continue-banner {
        margin-top: 2rem;
        display: flex; align-items: center; gap: 1.5rem;
        padding: 1.25rem 1.75rem;
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-top: 3px solid var(--accent);
        border-radius: 0 0 var(--radius-lg) var(--radius-lg);
        position: relative; overflow: hidden;
        animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both;
      }
      .continue-banner::before {
        content: ''; position: absolute; inset: 0;
        background: radial-gradient(ellipse at 20% 50%, var(--accent-dim) 0%, transparent 60%);
        pointer-events: none;
      }
      .continue-pulse {
        width: 44px; height: 44px; border-radius: 10px;
        background: var(--accent); color: var(--text-inverse);
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; animation: pulse-ring 2s ease-in-out infinite;
        position: relative; z-index: 1;
      }
      [data-theme="light"] .continue-pulse {
        animation-name: pulse-ring-light;
      }
      .continue-pulse svg { width: 22px; height: 22px; }
      
      .continue-info { flex: 1; min-width: 0; position: relative; z-index: 1; }
      .continue-meta {
        font-family: var(--font-mono); font-size: 11px; font-weight: 500;
        letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent);
        margin-bottom: 2px;
      }
      .continue-title {
        font-size: 16px; font-weight: 600; color: var(--text-primary);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .continue-sub { font-size: 13px; color: var(--text-secondary); }
      .continue-right {
        display: flex; align-items: center; gap: 1.25rem; flex-shrink: 0;
        position: relative; z-index: 1;
      }
      .mini-prog-wrap { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
      .mini-prog-bar { width: 110px; height: 4px; border-radius: 2px; background: var(--bg-elevated); overflow: hidden; }
      .mini-prog-fill { height: 100%; border-radius: 2px; background: var(--accent); transition: width 0.5s ease; }
      
      .continue-cta {
        font-family: var(--font-sans); font-size: 13px; font-weight: 600;
        padding: 7px 16px;
        background: var(--accent); color: var(--text-inverse);
        border: none; border-radius: var(--radius-md); cursor: pointer;
        text-decoration: none; display: inline-flex; align-items: center; gap: 0.3rem;
        white-space: nowrap; transition: 0.18s ease;
      }
      .continue-cta:hover { transform: translateY(-1px); box-shadow: var(--shadow-md); }

      /* Stats row */
      .dash-stats-row {
        display: grid; grid-template-columns: repeat(3, 1fr);
        gap: 12px; margin-top: 28px;
        animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.2s both;
      }
      .dash-stat-cell {
        background: var(--bg-card); border: 1px solid var(--border);
        border-radius: var(--radius-md); padding: 16px 20px;
        display: flex; flex-direction: column; gap: 2px;
      }
      .dash-stat-num {
        font-family: var(--font-mono); font-size: 28px; font-weight: 700;
        color: var(--text-primary); line-height: 1;
      }
      .dash-stat-num .nc { color: var(--accent); }
      .dash-stat-label { font-size: 12px; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px; }

      /* Section header + mode toggle */
      .dash-section-header {
        display: flex; align-items: center; justify-content: space-between;
        margin-top: 48px; margin-bottom: 20px;
        animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.3s both;
      }
      .dash-section-title {
        font-family: var(--font-mono); font-size: 12px; font-weight: 500;
        letter-spacing: 1px; text-transform: uppercase; color: var(--text-muted);
      }
      .dash-mode-toggle {
        display: flex; gap: 4px;
      }
      .dash-mode-opt {
        font-family: var(--font-sans); font-size: 12px; font-weight: 500;
        padding: 6px 14px; border-radius: var(--radius-md); border: 1px solid var(--border);
        background: transparent; color: var(--text-muted);
        cursor: pointer; transition: 0.18s ease;
        display: flex; align-items: center; gap: 6px;
      }
      .dash-mode-opt.active { background: var(--accent-dim); color: var(--accent); border-color: var(--border-accent); }
      .dash-mode-opt:not(.active):hover { border-color: var(--text-muted); }

      /* Module cards */
      .dash-modules-grid {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
      }
      .module-card {
        background: var(--bg-card); border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        display: flex; flex-direction: column; min-height: 200px;
        cursor: pointer; position: relative; overflow: hidden;
        opacity: 0;
        animation: fadeUp 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
      }
      .card-inner { padding: 20px; flex: 1; display: flex; flex-direction: column; gap: 12px; transition: opacity 0.2s ease; }
      
      .mc-stripe {
        position: absolute; top: 0; left: 0; right: 0; height: 2px;
        background: var(--accent);
      }
      
      /* States */
      .module-card.mc-in-progress {
        border-color: var(--border-accent);
        box-shadow: inset 3px 0 0 0 var(--accent-glow), var(--glow-green);
      }
      .module-card.mc-in-progress.mc-hovered {
        box-shadow: inset 3px 0 0 0 rgba(200,245,66,0.15), 0 0 32px rgba(200,245,66,0.18);
        transform: translateY(-2px);
      }
      
      .module-card.mc-complete { border-left: 3px solid var(--success); }
      .module-card.mc-complete.mc-hovered { border-color: var(--success); }
      
      .module-card.mc-locked { cursor: not-allowed; }
      .module-card.mc-locked .card-inner { opacity: 0.5; }

      .mc-top { display: flex; align-items: center; justify-content: space-between; }
      .mc-num {
        font-family: var(--font-mono); font-size: 32px; font-weight: 700;
        color: var(--text-secondary); line-height: 1; opacity: 0.7;
        transition: color 0.18s ease;
      }
      .mc-in-progress .mc-num { color: var(--accent); opacity: 1; }
      .mc-complete .mc-num { color: var(--success); opacity: 0.7; }
      .mc-locked .mc-num { color: var(--text-muted); opacity: 0.4; }

      .mc-badge {
        font-family: var(--font-mono); font-size: 10px; font-weight: 600;
        letter-spacing: 0.5px; text-transform: uppercase;
        padding: 3px 10px; border-radius: var(--radius-full);
      }
      .mc-badge-progress { background: var(--accent-dim); color: var(--accent); }
      .mc-badge-idle { background: var(--bg-elevated); color: var(--text-muted); }
      .mc-badge-done { background: var(--success-dim); color: var(--success); }
      .mc-badge-locked { background: var(--bg-elevated); color: var(--warning); }

      .mc-title {
        font-size: 16px; font-weight: 600; color: var(--text-primary);
        line-height: 1.3;
      }
      .mc-skills { display: flex; flex-wrap: wrap; gap: 5px; }
      .mc-skill {
        font-family: var(--font-mono); font-size: 10px; font-weight: 500;
        padding: 2px 8px; border-radius: var(--radius-sm);
        background: var(--bg-elevated); color: var(--text-muted);
        border: 1px solid var(--border);
      }
      .mc-skill.overflow { background: transparent; border-color: var(--border); color: var(--text-muted); font-style: italic; }

      .mc-footer {
        display: flex; align-items: center; justify-content: space-between;
        margin-top: auto; padding-top: 8px; gap: 12px;
      }
      .mc-prog-bar { flex: 1; height: 3px; border-radius: var(--radius-full); background: var(--bg-elevated); overflow: hidden; }
      .mc-prog-fill { height: 100%; border-radius: var(--radius-full); background: var(--accent); transition: width 0.5s ease; }
      .mc-prog-fill.complete-fill { background: var(--success); }
      
      .mc-diff-dots { display: flex; gap: 3px; }
      .mc-dot { width: 4px; height: 12px; border-radius: 2px; background: var(--border-main); }
      .mc-dot.filled { background: var(--accent); }
      .mc-dot.filled-success { background: var(--success); }
      
      .mc-prog-text {
        font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);
      }

      @media (max-width: 900px) { .dash-modules-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 768px) {
        .dash-modules-grid { grid-template-columns: 1fr; }
        .dash-stats-row { grid-template-columns: 1fr; }
        .continue-banner { flex-direction: column; align-items: flex-start; }
        .continue-right { width: 100%; justify-content: space-between; }
        .mini-prog-bar { width: 80px; }
      }
    </style>

    <div class="container" style="padding-top: 0; padding-bottom: 5rem;">

      <!-- Continue Banner -->
      <div class="continue-banner">
        <div class="continue-pulse">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <div class="continue-info">
          <div class="continue-meta">Continue where you left off</div>
          <div class="continue-title">${continueTitleText}</div>
          <div class="continue-sub">${continueSubText}</div>
        </div>
        <div class="continue-right">
          <div class="mini-prog-wrap">
            <div class="mini-prog-bar">
              <div class="mini-prog-fill" style="width:${continueProgressPct}%"></div>
            </div>
          </div>
          <a href="${continueHref}" class="continue-cta">Continue &rarr;</a>
        </div>
      </div>

      <!-- Stats row -->
      <div class="dash-stats-row">
        ${totalSolved === 0 ? `
          <div class="dash-stat-cell">
            <div class="dash-stat-num">87</div>
            <div class="dash-stat-label">Challenges waiting</div>
          </div>
          <div class="dash-stat-cell">
            <div class="dash-stat-num">10</div>
            <div class="dash-stat-label">Modules to explore</div>
          </div>
          <div class="dash-stat-cell">
            <div class="dash-stat-num">$0</div>
            <div class="dash-stat-label">Completely free</div>
          </div>
        ` : `
          <div class="dash-stat-cell">
            <div class="dash-stat-num"><span class="nc">${totalSolved}</span> / ${totalProblems}</div>
            <div class="dash-stat-label">Problems solved</div>
          </div>
          <div class="dash-stat-cell">
            <div class="dash-stat-num">${modulesInProgress}</div>
            <div class="dash-stat-label">Module${modulesInProgress !== 1 ? 's' : ''} in progress</div>
          </div>
          <div class="dash-stat-cell">
            <div class="dash-stat-num">${modulesRemaining}</div>
            <div class="dash-stat-label">Module${modulesRemaining !== 1 ? 's' : ''} remaining</div>
          </div>
        `}
      </div>

      <!-- Section header + mode toggle -->
      <div class="dash-section-header">
        <div class="dash-section-title">All Modules</div>
        <div class="dash-mode-toggle">
          <button id="mode-gated" class="dash-mode-opt ${currentMode === 'gated' ? 'active' : ''}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Guided
          </button>
          <button id="mode-explore" class="dash-mode-opt ${currentMode === 'explore' ? 'active' : ''}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
            Explore
          </button>
        </div>
      </div>

      <!-- Modules grid -->
      <div class="dash-modules-grid">
        ${levelCards}
      </div>

    </div>
  `;
}
