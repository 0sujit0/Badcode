import problems from '../data/problems.json';
import { getAllLevelsProgress } from '../store/progress.js';

const LEVEL_NAMES = {
  1: 'Foundations', 2: 'Querying Basics', 3: 'Filtering & Sorting',
  4: 'Aggregation',  5: 'Joins',           6: 'Data Manipulation',
  7: 'Functions',    8: 'Advanced SQL'
};

const TOTAL_LEVELS = 8;

export default function LevelCompletePage() {
  const hash = window.location.hash;
  const levelId = parseInt(hash.split('/').pop(), 10) || 1;
  const levelsData = getAllLevelsProgress(problems);
  const data = levelsData[levelId] || { total: 5, completed: 0, withAssist: 0 };

  const levelName = LEVEL_NAMES[levelId] || `Level ${levelId}`;
  const solved = data.completed;
  const total = data.total || 5;
  const hintsUsed = data.withAssist;
  const cleanSolves = solved - hintsUsed;
  const isLastLevel = levelId >= TOTAL_LEVELS;

  // Stars: 3 stars = all clean, 2 stars = all solved with some hints, 1 star = partial
  const stars = solved === total && cleanSolves === total ? 3
    : solved === total ? 2
    : solved > 0 ? 1
    : 0;

  const starSvg = (filled) => `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="${filled ? 'var(--accent)' : 'none'}" stroke="${filled ? 'var(--accent)' : 'var(--border-hover)'}" stroke-width="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  `;

  return `
    <div class="container" style="max-width: 640px; margin: 0 auto; padding-top: 4rem; padding-bottom: 6rem;">

      <!-- Back link -->
      <a href="#/level/${levelId}" style="
        display: inline-flex; align-items: center; gap: 0.4rem;
        text-decoration: none; color: var(--text-muted);
        font-size: 0.8rem; font-weight: 500; margin-bottom: 2rem;
        transition: color 0.15s;
      " onmouseenter="this.style.color='var(--text-secondary)'"
         onmouseleave="this.style.color='var(--text-muted)'">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to Level
      </a>

      <!-- Main card -->
      <div class="card-dark" style="text-align: center; padding: 3rem 2.5rem;">

        <!-- Success icon -->
        <div style="
          display: inline-flex; align-items: center; justify-content: center;
          width: 72px; height: 72px; border-radius: 50%;
          background: rgba(200, 245, 66, 0.1);
          border: 1px solid rgba(200, 245, 66, 0.25);
          margin-bottom: 1.5rem;
        ">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>

        <!-- Stars -->
        <div style="display: flex; justify-content: center; gap: 0.35rem; margin-bottom: 1.5rem;">
          ${[1,2,3].map(n => starSvg(n <= stars)).join('')}
        </div>

        <!-- Heading -->
        ${isLastLevel ? `
          <h1 style="font-size: 2rem; margin-bottom: 0.75rem; color: #E8E6E3; line-height: 1.2;">
            You've completed <span style="color: var(--accent);">badcode</span>!
          </h1>
          <p style="color: #9A9898; font-size: 1rem; margin-bottom: 2rem; line-height: 1.6;">
            You've solved all 40 problems. That's seriously impressive — you're an SQL pro.
          </p>
        ` : `
          <h1 style="font-size: 2rem; margin-bottom: 0.75rem; color: #E8E6E3; line-height: 1.2;">
            Level ${levelId} complete!
          </h1>
          <p style="color: #9A9898; font-size: 1rem; margin-bottom: 2rem; line-height: 1.6;">
            You finished <strong style="color: #E8E6E3;">${levelName}</strong>. Keep the momentum going!
          </p>
        `}

        <!-- Stats grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 2.5rem;">
          <div style="background: rgba(255,255,255,0.05); padding: 1.25rem 1rem; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.06);">
            <div style="font-size: 2rem; font-weight: 700; color: var(--success); line-height: 1;">${solved}</div>
            <div style="font-size: 0.75rem; color: #9A9898; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 0.4rem;">Solved</div>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 1.25rem 1rem; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.06);">
            <div style="font-size: 2rem; font-weight: 700; color: var(--accent); line-height: 1;">${cleanSolves}</div>
            <div style="font-size: 0.75rem; color: #9A9898; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 0.4rem;">Clean Solves</div>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 1.25rem 1rem; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.06);">
            <div style="font-size: 2rem; font-weight: 700; color: #9A9898; line-height: 1;">${hintsUsed}</div>
            <div style="font-size: 0.75rem; color: #9A9898; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 0.4rem;">Used Hints</div>
          </div>
        </div>

        <!-- CTAs -->
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${!isLastLevel ? `
            <a href="#/level/${levelId + 1}" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 0.9rem; font-size: 1rem;">
              Next Level: ${LEVEL_NAMES[levelId + 1] || 'Level ' + (levelId + 1)} &rarr;
            </a>
          ` : ''}
          <a href="#/dashboard" class="btn btn-outline" style="width: 100%; justify-content: center; padding: 0.9rem; font-size: 1rem;">
            Back to Modules
          </a>
        </div>
      </div>
    </div>
  `;
}
