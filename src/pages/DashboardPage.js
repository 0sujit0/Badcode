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
  const continueTitleText = continueProblem
    ? `${LEVEL_NAMES[continueLevelId]} — ${continueProblem.title}`
    : LEVEL_NAMES[continueLevelId];
  const continueSubText = continueProblem
    ? continueProblem.story.replace(/<[^>]*>?/gm, '').slice(0, 72) + '…'
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

    const skills = LEVEL_SKILLS[level] || [];
    const skillTags = skills.map(s => `<span class="mc-skill">${s}</span>`).join('');

    const dotCount = diff.label === 'Beginner' ? 1 : diff.label === 'Intermediate' ? 2 : 3;
    const dots = [1, 2, 3].map(n =>
      `<span class="mc-dot" style="${n <= dotCount ? `background:${diff.varColor};` : ''}"></span>`
    ).join('');

    const hoverEvents = !levelLocked ? `
      onmouseenter="this.classList.add('mc-hovered')"
      onmouseleave="this.classList.remove('mc-hovered')"
    ` : '';

    return `
      <div
        class="module-card ${stateClass}"
        style="animation-delay: ${400 + idx * 70}ms;"
        ${!levelLocked ? `onclick="window.location.hash='#/level/${level}'"` : ''}
        ${hoverEvents}
      >
        ${isInProgress ? '<div class="mc-stripe"></div>' : ''}
        <div class="mc-top">
          <div class="mc-num">${String(level).padStart(2, '0')}</div>
          ${badgeHtml}
        </div>
        <div class="mc-title">${LEVEL_NAMES[level]}</div>
        <div class="mc-skills">${skillTags}</div>
        <div class="mc-footer">
          <div class="mc-prog-bar">
            <div class="mc-prog-fill progress-fill" style="width:${progressPct}%"></div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
            <div class="mc-diff-dots">${dots}</div>
            <span class="mc-prog-text">${data.completed}/${data.total}</span>
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
        border: 1px solid var(--border-accent);
        border-radius: var(--radius-lg);
        position: relative; overflow: hidden;
        animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both;
      }
      .continue-banner::before {
        content: ''; position: absolute; inset: 0;
        background: radial-gradient(ellipse at 0% 50%, var(--accent-tint) 0%, transparent 60%);
        pointer-events: none;
      }
      .continue-pulse {
        width: 44px; height: 44px; border-radius: 10px;
        background: var(--accent); color: var(--text-inverse);
        display: flex; align-items: center; justify-content: center;
        font-family: var(--font-mono); font-weight: 800; font-size: 1rem;
        flex-shrink: 0; animation: pulse-glow-dash 3s ease-in-out infinite;
        position: relative; z-index: 1;
      }
      @keyframes pulse-glow-dash {
        0%,100% { box-shadow: 0 0 16px var(--accent-tint-strong); }
        50% { box-shadow: 0 0 28px rgba(200,255,0,0.22); }
      }
      .continue-info { flex: 1; min-width: 0; position: relative; z-index: 1; }
      .continue-meta {
        font-family: var(--font-mono); font-size: 0.62rem; font-weight: 600;
        letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent);
        margin-bottom: 0.2rem;
      }
      .continue-title {
        font-size: 0.93rem; font-weight: 700; color: var(--text-primary);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        margin-bottom: 0.15rem;
      }
      .continue-sub { font-size: 0.76rem; color: var(--text-muted); }
      .continue-right {
        display: flex; align-items: center; gap: 1.25rem; flex-shrink: 0;
        position: relative; z-index: 1;
      }
      .mini-prog-wrap { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
      .mini-prog-label { font-family: var(--font-mono); font-size: 0.62rem; color: var(--text-muted); }
      .mini-prog-bar { width: 110px; height: 3px; border-radius: 2px; background: var(--bg-elevated); overflow: hidden; }
      .mini-prog-fill { height: 100%; border-radius: 2px; background: var(--accent); }
      .continue-cta {
        font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700;
        padding: 0.5rem 1.1rem;
        background: var(--accent); color: var(--text-inverse);
        border: none; border-radius: var(--radius-sm); cursor: pointer;
        text-decoration: none; display: inline-flex; align-items: center; gap: 0.3rem;
        white-space: nowrap; transition: background 0.2s, transform 0.2s;
      }
      .continue-cta:hover { background: var(--accent-yellow-hover); transform: translateX(2px); }

      /* Stats row */
      .dash-stats-row {
        display: grid; grid-template-columns: repeat(3, 1fr);
        gap: 2px; margin-top: 1.25rem;
        border-radius: var(--radius-md); overflow: hidden;
        animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.2s both;
      }
      .dash-stat-cell {
        background: var(--bg-card); padding: 1rem 1.25rem;
        display: flex; flex-direction: column; gap: 2px;
      }
      .dash-stat-num {
        font-family: var(--font-mono); font-size: 1.3rem; font-weight: 800;
        color: var(--text-primary); line-height: 1;
      }
      .dash-stat-num .nc { color: var(--accent); }
      .dash-stat-label { font-size: 0.72rem; color: var(--text-muted); font-weight: 500; }

      /* Section header + mode toggle */
      .dash-section-header {
        display: flex; align-items: center; justify-content: space-between;
        margin-top: 3rem; margin-bottom: 1.25rem;
        animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.3s both;
      }
      .dash-section-title {
        font-family: var(--font-mono); font-size: 0.68rem; font-weight: 600;
        letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted);
      }
      .dash-mode-toggle {
        display: flex; align-items: center;
        background: var(--bg-elevated); border: 1px solid var(--border);
        border-radius: var(--radius-sm); padding: 3px; gap: 2px;
      }
      .dash-mode-opt {
        font-family: var(--font-mono); font-size: 0.68rem; font-weight: 600;
        padding: 0.3rem 0.8rem; border-radius: 4px; border: none;
        background: transparent; color: var(--text-muted);
        cursor: pointer; transition: all 0.15s;
        display: flex; align-items: center; gap: 4px;
      }
      .dash-mode-opt.active { background: var(--bg-card); color: var(--text-primary); }

      /* Module cards */
      .dash-modules-grid {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
      }
      .module-card {
        background: var(--bg-card); border: 1px solid var(--border);
        border-radius: var(--radius-lg); padding: 1.5rem;
        display: flex; flex-direction: column; min-height: 200px;
        cursor: pointer; position: relative; overflow: hidden;
        opacity: 0;
        animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both;
        transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), border-color 0.25s, box-shadow 0.25s;
      }
      .mc-stripe {
        position: absolute; top: 0; left: 0; right: 0; height: 3px;
        background: var(--accent);
      }
      .mc-in-progress { border-color: var(--border-accent); }
      .mc-in-progress::after {
        content: ''; position: absolute; inset: 0;
        background: radial-gradient(ellipse at 30% 0%, var(--accent-tint) 0%, transparent 50%);
        pointer-events: none;
      }
      .mc-hovered.mc-in-progress {
        border-color: rgba(200,245,66,0.4) !important;
        transform: translateY(-4px) !important;
        box-shadow: 0 8px 40px var(--accent-tint) !important;
      }
      .mc-hovered.mc-not-started,
      .mc-hovered.mc-complete {
        transform: translateY(-2px) !important;
        border-color: var(--border-hover) !important;
      }
      .mc-complete { border-color: var(--success-border); }
      .mc-locked { cursor: default; }
      .mc-locked .mc-num,
      .mc-locked .mc-title,
      .mc-locked .mc-skills,
      .mc-locked .mc-footer { opacity: 0.35; }

      .mc-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.9rem; }
      .mc-num {
        font-family: var(--font-mono); font-size: 2.1rem; font-weight: 800;
        color: var(--text-muted); line-height: 1; letter-spacing: -0.04em;
      }
      .mc-in-progress .mc-num { color: var(--accent); }
      .mc-complete .mc-num { color: var(--success); }

      .mc-badge {
        font-family: var(--font-mono); font-size: 0.6rem; font-weight: 700;
        letter-spacing: 0.05em; text-transform: uppercase;
        padding: 0.2rem 0.55rem; border-radius: 999px;
        display: inline-flex; align-items: center; gap: 4px;
      }
      .mc-badge-progress { background: var(--accent-tint); border: 1px solid var(--border-accent); color: var(--accent); }
      .mc-badge-idle { background: transparent; border: 1px solid var(--border); color: var(--text-muted); }
      .mc-badge-done { background: var(--success-dim); border: 1px solid var(--success-border); color: var(--success); }
      .mc-badge-locked { background: transparent; border: 1px solid var(--border); color: var(--text-muted); }

      .mc-title {
        font-size: 1.1rem; font-weight: 700; color: var(--text-primary);
        margin-bottom: 0.6rem; letter-spacing: -0.02em; line-height: 1.2;
      }
      .mc-skills { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: auto; }
      .mc-skill {
        font-family: var(--font-mono); font-size: 0.6rem; font-weight: 500;
        padding: 2px 7px; border-radius: 4px;
        background: var(--bg-elevated); color: var(--text-muted);
        border: 1px solid transparent;
      }
      .mc-in-progress .mc-skill {
        background: var(--accent-tint);
        border-color: var(--border-accent);
        color: var(--text-secondary);
      }

      .mc-footer {
        display: flex; align-items: center; justify-content: space-between;
        margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border); gap: 0.75rem;
      }
      .mc-prog-bar { flex: 1; height: 3px; border-radius: 2px; background: var(--bg-elevated); overflow: hidden; }
      .mc-prog-fill { height: 100%; border-radius: 2px; background: var(--accent); }
      .mc-diff-dots { display: flex; gap: 3px; align-items: center; }
      .mc-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--bg-elevated); flex-shrink: 0; }
      .mc-prog-text {
        font-family: var(--font-mono); font-size: 0.65rem; font-weight: 600; color: var(--text-muted);
      }
      .mc-in-progress .mc-prog-text { color: var(--text-secondary); }

      @media (max-width: 900px) { .dash-modules-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 580px) {
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
        <div class="continue-pulse">${String(continueLevelId).padStart(2, '0')}</div>
        <div class="continue-info">
          <div class="continue-meta">Continue where you left off</div>
          <div class="continue-title">${continueTitleText}</div>
          <div class="continue-sub">${continueSubText}</div>
        </div>
        <div class="continue-right">
          <div class="mini-prog-wrap">
            <span class="mini-prog-label">${continueLevelData.completed} / ${continueLevelData.total} missions</span>
            <div class="mini-prog-bar">
              <div class="mini-prog-fill progress-fill" style="width:${continueProgressPct}%"></div>
            </div>
          </div>
          <a href="${continueHref}" class="continue-cta">${totalSolved === 0 ? 'Start' : 'Continue'} &rarr;</a>
        </div>
      </div>

      <!-- Stats row -->
      <div class="dash-stats-row">
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
      </div>

      <!-- Section header + mode toggle -->
      <div class="dash-section-header">
        <div class="dash-section-title">All Modules</div>
        <div class="dash-mode-toggle">
          <button id="mode-gated" class="dash-mode-opt ${currentMode === 'gated' ? 'active' : ''}">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Guided
          </button>
          <button id="mode-explore" class="dash-mode-opt ${currentMode === 'explore' ? 'active' : ''}">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
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
