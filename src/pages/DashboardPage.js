import { getAllLevelsProgress, getLocalProgress, isLevelUnlocked, getMode, setMode } from '../store/progress.js';
import problems from '../data/problems.json';

const LEVEL_NAMES = {
  1: 'Foundations',       2: 'Querying Basics',   3: 'Filtering & Sorting',
  4: 'Aggregation',       5: 'Joins',              6: 'Data Manipulation',
  7: 'Functions',         8: 'Advanced SQL'
};

const LEVEL_DIFFS = {
  1: { label: 'Beginner',     color: '#84cc16' },
  2: { label: 'Beginner',     color: '#84cc16' },
  3: { label: 'Beginner',     color: '#84cc16' },
  4: { label: 'Intermediate', color: '#eab308' },
  5: { label: 'Intermediate', color: '#eab308' },
  6: { label: 'Intermediate', color: '#eab308' },
  7: { label: 'Intermediate', color: '#eab308' },
  8: { label: 'Advanced',     color: '#ef4444' }
};

const LEVEL_KEYWORDS = {
  1: 'SELECT · DISTINCT · ALIASES · CONCATENATION',
  2: 'WHERE · AND · OR · LIKE · NOT · OPERATORS',
  3: 'ORDER BY · LIMIT · OFFSET · IN · NOT IN · BETWEEN',
  4: 'COUNT · SUM · AVG · MIN · MAX · GROUP BY · HAVING',
  5: 'INNER JOIN · LEFT JOIN · MULTI-TABLE · AGGREGATION',
  6: 'INSERT · UPDATE · DELETE · DML OPERATIONS',
  7: 'SUBSTR · INSTR · LENGTH · UPPER · LOWER · CAST · REPLACE',
  8: 'WINDOW FUNCTIONS · CASE WHEN · UNION · CTEs · SUBQUERIES'
};

export default function DashboardPage() {
  const levelsData = getAllLevelsProgress(problems);
  const allLevels = [1, 2, 3, 4, 5, 6, 7, 8];
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

  // Overall progress
  const totalProblems = problems.length;
  const totalSolved = Object.values(levelsData).reduce((sum, d) => sum + d.completed, 0);
  const overallPct = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  // Find first incomplete level for "Continue" button
  let continueLevel = null;
  for (const level of allLevels) {
    const d = levelsData[level] || { total: 0, completed: 0 };
    if (d.completed < d.total) { continueLevel = level; break; }
  }
  // If all done, still link to level 8
  if (!continueLevel) continueLevel = 8;

  const levelCards = allLevels.map(level => {
    const data = levelsData[level] || { total: 0, completed: 0, withAssist: 0 };
    const diff = LEVEL_DIFFS[level];
    const progressPct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
    const levelLocked = !isLevelUnlocked(level, problems);

    // Status
    let statusBadge = '';
    if (levelLocked) {
      statusBadge = `<span class="dashboard-badge" style="color:var(--text-muted);background:var(--bg-elevated);border:1px solid var(--border);display:flex;align-items:center;gap:0.3rem;"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Locked</span>`;
    } else if (data.total === 0 || data.completed === 0) {
      statusBadge = `<span class="dashboard-badge dashboard-badge-idle">Not started</span>`;
    } else if (data.completed < data.total) {
      statusBadge = `<span class="dashboard-badge dashboard-badge-progress">In progress</span>`;
    } else {
      statusBadge = `<span class="dashboard-badge dashboard-badge-done">&#x2713; Complete</span>`;
    }

    // Progress bar — always visible (greyed at 0%)
    const barColor = progressPct === 100 ? 'var(--success)' : 'var(--accent-yellow-hover)';
    const progressBar = `
      <div style="margin-top: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
          <span style="font-size: 0.7rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">
            ${LEVEL_KEYWORDS[level]}
          </span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="flex: 1; height: 4px; background: var(--bg-elevated); border-radius: 2px; overflow: hidden;">
            <div class="progress-fill" style="height: 100%; width: ${progressPct}%; background: ${barColor}; border-radius: 2px;"></div>
          </div>
          <span style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: ${progressPct > 0 ? 'var(--text-secondary)' : 'var(--text-muted)'}; white-space: nowrap;">
            ${data.completed} / ${data.total}
          </span>
        </div>
      </div>
    `;

    return `
      <div
        style="
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.75rem;
          display: flex; flex-direction: column;
          cursor: ${levelLocked ? 'default' : 'pointer'};
          opacity: ${levelLocked ? '0.5' : '1'};
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s, background 0.2s;
          ${progressPct === 100 ? 'border-color: rgba(74,222,128,0.2);' : ''}
        "
        ${!levelLocked ? `
        onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-lg)'; this.style.borderColor='var(--border-hover)';"
        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow=''; this.style.borderColor='${progressPct === 100 ? 'rgba(74,222,128,0.2)' : 'var(--border)'}';"
        onclick="window.location.hash='#/level/${level}'"` : ''}
      >
        <!-- Top row: difficulty + status -->
        <div style="display: flex; justify-content: flex-end; align-items: flex-start; gap: 0.4rem;">
          ${!levelLocked ? `<span style="
            background: var(--bg-elevated); border: 1px solid var(--border);
            color: var(--text-secondary); border-radius: 999px;
            padding: 0.15rem 0.65rem; font-size: 0.72rem; font-weight: 500;
            display: flex; align-items: center; gap: 0.35rem;
          ">
            <span style="width: 7px; height: 7px; border-radius: 50%; background: ${diff.color}; display: inline-block; flex-shrink: 0;"></span>
            ${diff.label}
          </span>` : ''}
          ${statusBadge}
        </div>

        <!-- Number prefix + Title -->
        <div style="margin-top: 0.75rem;">
          <span style="font-size: 0.72rem; font-weight: 600; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; font-family: var(--font-mono);">0${level}</span>
          <h3 style="margin-top: 0.3rem; font-size: 1.5rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.4px; line-height: 1.2;">
            ${LEVEL_NAMES[level]}
          </h3>
        </div>

        <!-- Progress bar + keyword tags -->
        <div style="margin-top: auto;">
          ${progressBar}
        </div>
      </div>
    `;
  }).join('');

  return `
    <style>
      .dashboard-badge {
        font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
        letter-spacing: 0.06em; padding: 0.18rem 0.55rem;
        border-radius: 999px; white-space: nowrap;
      }
      .dashboard-badge-idle { color: var(--text-muted); background: var(--bg-elevated); border: 1px solid var(--border); }
      .dashboard-badge-progress { color: var(--accent); background: var(--accent-dim); border: 1px solid var(--border-accent); }
      .dashboard-badge-done { color: var(--success); background: var(--success-dim); border: 1px solid rgba(74,222,128,0.2); }
    </style>

    <div class="container" style="padding-top: 2.5rem; padding-bottom: 5rem;">

      <!-- Header -->
      <div style="margin-bottom: 2rem; animation: fadeUp 0.4s ease both;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
          <div>
            <h1 style="font-size: clamp(1.6rem, 3.5vw, 2.2rem); font-weight: 700; letter-spacing: -0.03em; margin-bottom: 0.4rem;">
              Your Progress
            </h1>
            <p style="color: var(--text-secondary); font-size: 0.95rem;">
              ${totalSolved} of ${totalProblems} problems solved across all levels
            </p>
          </div>
          <!-- Mode toggle -->
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.35rem;flex-shrink:0;">
            <span style="font-size:0.7rem;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.07em;">Mode</span>
            <div style="display:flex;background:var(--bg-elevated);border:1px solid var(--border);border-radius:999px;padding:3px;gap:2px;">
              <button id="mode-gated" style="
                display:flex;align-items:center;gap:0.35rem;
                padding:0.3rem 0.85rem;border-radius:999px;border:none;
                font-family:var(--font-sans);font-size:0.78rem;font-weight:${currentMode === 'gated' ? '700' : '500'};
                cursor:pointer;transition:all 0.15s;
                background:${currentMode === 'gated' ? 'var(--text-primary)' : 'transparent'};
                color:${currentMode === 'gated' ? 'var(--bg-page)' : 'var(--text-muted)'};
              ">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Guided
              </button>
              <button id="mode-explore" style="
                display:flex;align-items:center;gap:0.35rem;
                padding:0.3rem 0.85rem;border-radius:999px;border:none;
                font-family:var(--font-sans);font-size:0.78rem;font-weight:${currentMode === 'explore' ? '700' : '500'};
                cursor:pointer;transition:all 0.15s;
                background:${currentMode === 'explore' ? 'var(--accent)' : 'transparent'};
                color:${currentMode === 'explore' ? 'var(--text-inverse)' : 'var(--text-muted)'};
              ">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                Explore
              </button>
            </div>
            <span style="font-size:0.68rem;color:var(--text-muted);max-width:180px;text-align:right;line-height:1.4;">
              ${currentMode === 'explore' ? 'All levels unlocked — practice freely.' : 'Complete 80% of each level to unlock the next.'}
            </span>
          </div>
        </div>
      </div>

      <!-- Overall progress bar + Continue CTA -->
      <div style="
        background: var(--bg-card); border: 1px solid var(--border);
        border-radius: var(--radius-lg); padding: 1.5rem 1.75rem;
        margin-bottom: 2rem;
        display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;
        animation: fadeUp 0.4s ease 0.05s both;
      ">
        <div style="flex: 1; min-width: 200px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
            <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Overall</span>
            <span style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; color: ${overallPct > 0 ? 'var(--accent)' : 'var(--text-muted)'};">${overallPct}%</span>
          </div>
          <div style="height: 6px; background: var(--bg-elevated); border-radius: 3px; overflow: hidden;">
            <div class="progress-fill" style="height: 100%; width: ${overallPct}%; background: var(--accent); border-radius: 3px;"></div>
          </div>
          <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-muted);">
            ${totalSolved} / ${totalProblems} problems
          </div>
        </div>
        <a href="#/level/${continueLevel}" class="btn btn-primary" style="flex-shrink: 0; padding: 0.65rem 1.4rem;">
          ${totalSolved === 0 ? 'Start Learning' : 'Continue'} &rarr;
        </a>
      </div>

      <!-- Level cards grid -->
      <div class="grid-dashboard">
        ${levelCards}
      </div>

    </div>
  `;
}
