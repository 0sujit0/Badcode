import { getAllLevelsProgress } from '../store/progress.js';
import problems from '../data/problems.json';

export default function DashboardPage() {
  const levelsData = getAllLevelsProgress(problems);
  
  // Make sure we have 8 modules visually to match the screenshot, even if some are empty for now
  const allLevels = [1, 2, 3, 4, 5, 6, 7, 8];
  
  const levelCards = allLevels.map(level => {
    const data = levelsData[level] || { total: 0, completed: 0, withAssist: 0 };
    const details = getLevelDetails(level);
    const progressPercent = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
    
    return `
      <div class="card flex-col" style="min-height: 200px; padding: 2rem; transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; display: flex; flex-direction: column;"
           onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='var(--shadow-lg)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-sm)'" onclick="window.location.hash='#/level/${level}'">
        
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <span style="font-size: 2.25rem; font-weight: 700; color: #a1a1aa; line-height: 1;">0${level}</span>
          <span style="background: var(--bg-primary); border: 1px solid var(--border-color); color: var(--text-secondary); border-radius: 999px; padding: 0.15rem 0.75rem; font-size: 0.75rem; font-weight: 500; display: flex; align-items: center; gap: 0.4rem;">
            <svg width="10" height="10" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="${details.diff.color}"/></svg>
            ${details.diff.label}
          </span>
        </div>
        
        <h3 style="margin-top: 1.5rem; font-size: 1.4rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.5px;">${details.title}</h3>
        
        <div style="margin-top: auto;">
          <p style="font-size: 0.7rem; letter-spacing: 0.5px; font-weight: 600; color: #a1a1aa; text-transform: uppercase; margin-top: 2rem;">
            ${details.keywords}
          </p>
          
          ${data.total > 0 && data.completed > 0 ? `
            <div style="margin-top: 1rem; width: 100%; height: 4px; background: var(--bg-secondary); border-radius: 2px; overflow: hidden;">
              <div style="height: 100%; width: ${progressPercent}%; background: ${progressPercent === 100 ? 'var(--success)' : 'var(--accent-yellow-hover)'}; border-radius: 2px;"></div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="container mt-8" style="padding-bottom: 4rem;">
      <div class="grid-dashboard">
        ${levelCards}
      </div>
    </div>
  `;
}

function getLevelDetails(level) {
  const titles = {
    1: 'Foundations',
    2: 'Querying Basics',
    3: 'Filtering & Sorting',
    4: 'Aggregation',
    5: 'Joins',
    6: 'Data Manipulation',
    7: 'Functions',
    8: 'Advanced SQL'
  };
  const diffs = {
    1: { label: 'Beginner', color: 'url(#grad-green)' },
    2: { label: 'Beginner', color: 'url(#grad-green)' },
    3: { label: 'Beginner', color: 'url(#grad-green)' },
    4: { label: 'Intermediate', color: 'url(#grad-yellow)' },
    5: { label: 'Intermediate', color: 'url(#grad-yellow)' },
    6: { label: 'Intermediate', color: 'url(#grad-yellow)' },
    7: { label: 'Intermediate', color: 'url(#grad-yellow)' },
    8: { label: 'Advanced', color: 'url(#grad-red)' }
  };
  
  // Quick hack to inject SVG definitions into the document for gradients to work globally
  if (!document.getElementById('svg-gradients')) {
    document.body.insertAdjacentHTML('beforeend', `<svg id="svg-gradients" width="0" height="0" style="position:absolute">
      <defs>
        <linearGradient id="grad-green" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#84cc16" /><stop offset="100%" stop-color="#22c55e" /></linearGradient>
        <linearGradient id="grad-yellow" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fde047" /><stop offset="100%" stop-color="#eab308" /></linearGradient>
        <linearGradient id="grad-red" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fca5a5" /><stop offset="100%" stop-color="#ef4444" /></linearGradient>
      </defs>
    </svg>`);
  }

  const keywords = {
    1: 'DATABASE HIERARCHY · DATA TYPES · SCHEMA BASICS',
    2: 'SELECT · DISTINCT · ALIASES · COMMENTS',
    3: 'WHERE · OPERATORS · LIKE · BETWEEN · IN · ORDER BY',
    4: 'GROUP BY · HAVING · COUNT · SUM · AVG · MIN / MAX',
    5: 'INNER · LEFT · RIGHT · FULL · CROSS · ANTI-JOIN',
    6: 'INSERT · UPDATE · DELETE · CREATE · ALTER · DROP',
    7: 'STRING · NUMERIC · DATE & TIME · NULL HANDLING',
    8: 'WINDOW FUNCTIONS · CASE WHEN · SET OPERATORS · CTES'
  };
  return { 
    title: titles[level] || `Level ${level}`,
    diff: diffs[level] || { label: 'Beginner', color: 'url(#grad-green)' },
    keywords: keywords[level] || 'SQL PRACTICE'
  };
}
