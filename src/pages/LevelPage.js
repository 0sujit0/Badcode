import problems from '../data/problems.json';
import { getProblemStatus, isLevelUnlocked } from '../store/progress.js';

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

// SQL concepts shown as the H1 in the hero — 2 lines max via <br>
const LEVEL_CONCEPTS_H1 = {
  1: 'SELECT &amp; DISTINCT,<br>ALIASES, CONCAT',
  2: 'WHERE, LIKE,<br>AND, OR, NOT',
  3: 'ORDER BY, LIMIT,<br>IN &amp; BETWEEN',
  4: 'COUNT, SUM, AVG,<br>GROUP BY &amp; HAVING',
  5: 'INNER JOIN,<br>LEFT JOIN &amp; SELF JOIN',
  6: 'COALESCE, IS NULL<br>&amp; NULL MATH',
  7: 'INSERT, UPDATE<br>&amp; DELETE',
  8: 'SUBSTR, UPPER,<br>REPLACE &amp; CAST',
  9: 'CASE WHEN, UNION<br>&amp; UNION ALL',
  10: 'WINDOW FUNCTIONS,<br>CTEs &amp; SUBQUERIES'
};

const LEVEL_DESCRIPTIONS = {
  1: 'Retrieve and shape data from ShopKart\'s tables. Each mission unlocks the next.',
  2: 'Filter, match, and exclude data from ShopKart\'s tables. Each mission unlocks the next.',
  3: 'Sort, limit, and filter ranges of data. Each mission unlocks the next.',
  4: 'Summarise and group data with aggregate functions. Each mission unlocks the next.',
  5: 'Combine data across multiple tables. Each mission unlocks the next.',
  6: 'Learn to handle missing data and the quirks of NULL logic.',
  7: 'Add, modify, and remove records from the database.',
  8: 'Transform text, format data, and work with dates.',
  9: 'Build complex conditional logic and stack query results.',
  10: 'Master the most powerful analytical tools in SQL.'
};

export default function LevelPage() {
  const hash = window.location.hash;
  const levelId = parseInt(hash.split('/').pop(), 10);

  const levelProblems = problems.filter(p => p.level === levelId);
  if (levelProblems.length === 0) {
    return `<div class="container" style="padding-top:4rem;color:var(--text-secondary);">Level not found.</div>`;
  }

  const locked = !isLevelUnlocked(levelId, problems);

  // Progress
  const completedCount = levelProblems.filter(p => getProblemStatus(p.id).completed).length;
  const total = levelProblems.length;

  // Active = first non-completed problem
  let activeIndex = -1;
  for (let i = 0; i < levelProblems.length; i++) {
    if (!getProblemStatus(levelProblems[i].id).completed) {
      activeIndex = i;
      break;
    }
  }
  if (completedCount === total) activeIndex = -1;

  // Animate progress ring on mount
  const ringCircumference = 2 * Math.PI * 36; // r=36 → ~226.2
  setTimeout(() => {
    const ring = document.getElementById('lvl-progress-ring');
    if (ring) {
      const offset = ringCircumference - (completedCount / total) * ringCircumference;
      ring.style.strokeDashoffset = offset;
    }
  }, 600);

  // Skill chips: unique requiredConcept values in order
  const conceptsLearned = new Set(
    levelProblems.filter(p => getProblemStatus(p.id).completed).map(p => p.requiredConcept)
  );
  const allConcepts = [...new Set(levelProblems.map(p => p.requiredConcept))];
  const skillChips = allConcepts.map(concept => {
    const learned = conceptsLearned.has(concept);
    return `
      <div class="lvl-skill-chip ${learned ? 'chip-learned' : ''}">
        <span class="chip-check">${learned ? '&#x2713;' : ''}</span>
        ${concept}
      </div>
    `;
  }).join('');

  // Mission cards — vertical list
  const cards = levelProblems.map((p, i) => {
    const status = getProblemStatus(p.id);
    const isCompleted = status.completed;
    const isActive    = i === activeIndex;
    const isFuture    = !isCompleted && !isActive; // upcoming, not yet accessible
    const cleanStory  = p.story.replace(/<[^>]*>?/gm, '');

    // Difficulty bars: first problem = 1, middle = 2, last = 3
    const diffLevel = i === 0 ? 1 : i === total - 1 ? 3 : 2;
    const diffBars = [1, 2, 3].map(n =>
      `<span class="lvl-diff-bar ${n <= diffLevel ? 'bar-filled' : ''}"></span>`
    ).join('');

    // Number badge
    let badgeContent = '';
    let badgeClass = 'lvl-num-badge-future';
    if (isCompleted) {
      badgeContent = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>`;
      badgeClass = 'lvl-num-badge-done';
    } else if (isActive) {
      badgeContent = `${i + 1}`;
      badgeClass = 'lvl-num-badge-active';
    } else {
      badgeContent = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
      badgeClass = 'lvl-num-badge-future';
    }

    // CTA button
    let ctaBtn = '';
    if (isActive) {
      ctaBtn = `<a href="#/lesson/${p.id}" onclick="event.stopPropagation()" class="lvl-cta-btn lvl-cta-start">
        Start
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>`;
    } else if (isCompleted) {
      ctaBtn = `<a href="#/lesson/${p.id}" onclick="event.stopPropagation()" class="lvl-cta-btn lvl-cta-review">
        Review
      </a>`;
    } else {
      // future — still clickable but looks locked
      ctaBtn = `<a href="#/lesson/${p.id}" onclick="event.stopPropagation()" class="lvl-cta-btn lvl-cta-locked">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </a>`;
    }

    let cardStateClass = '';
    if (isActive) cardStateClass = 'lvl-card-active';
    else if (isCompleted) cardStateClass = 'lvl-card-done';
    else cardStateClass = 'lvl-card-future';

    const hoverEvents = isActive ? `
      onmouseenter="this.style.transform='translateX(4px)';this.style.borderColor='rgba(200,245,66,0.3)';"
      onmouseleave="this.style.transform='';this.style.borderColor='';"
    ` : isCompleted ? `
      onmouseenter="this.style.borderColor='var(--border-hover)';"
      onmouseleave="this.style.borderColor='';"
    ` : '';

    return `
      <div
        class="lvl-mission-card ${cardStateClass}"
        style="animation: fadeUp 0.35s cubic-bezier(0.22,1,0.36,1) ${300 + i * 80}ms both;"
        onclick="window.location.hash='#/lesson/${p.id}'"
        ${hoverEvents}
      >
        ${isActive ? '<div class="lvl-card-stripe"></div>' : ''}
        ${isCompleted ? '<div class="lvl-card-stripe lvl-card-stripe-done"></div>' : ''}

        <!-- Number badge -->
        <div class="lvl-num-badge ${badgeClass}">${badgeContent}</div>

        <!-- Body -->
        <div class="lvl-card-body">
          <div class="lvl-card-title">${p.title}</div>
          <div class="lvl-card-desc">${cleanStory}</div>
          <div class="lvl-card-tags">
            <span class="lvl-concept-tag ${isActive ? 'tag-active' : ''}">${p.requiredConcept}</span>
          </div>
        </div>

        <!-- Action -->
        <div class="lvl-card-action">
          <div class="lvl-diff-bars">${diffBars}</div>
          ${ctaBtn}
        </div>
      </div>
    `;
  }).join('');

  return `
    <style>
      /* ─── Level Page Redesign ─── */
      @keyframes ring-fill {
        from { stroke-dashoffset: ${ringCircumference}; }
      }

      /* Hero */
      .lvl-hero {
        margin-top: 2.5rem; margin-bottom: 0;
        animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
      }
      .lvl-hero-inner {
        display: flex; align-items: flex-start; justify-content: space-between;
        gap: 2rem; margin-bottom: 28px;
      }
      .lvl-hero-content { flex: 1; }
      .lvl-level-tag {
        font-family: var(--font-mono); font-size: 0.68rem; font-weight: 600;
        letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent);
        display: flex; align-items: center; gap: 8px; margin-bottom: 10px;
      }
      .lvl-level-tag::before {
        content: ''; width: 14px; height: 2px; background: var(--accent); display: block;
      }
      .lvl-hero h1 {
        font-family: var(--font-mono) !important;
        font-size: clamp(1.5rem, 3.5vw, 2.1rem) !important;
        font-weight: 800 !important;
        letter-spacing: -0.04em !important;
        line-height: 1.15 !important;
        color: var(--text-primary) !important;
        margin-bottom: 8px;
      }
      .lvl-hero-desc {
        font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6;
        max-width: 460px;
      }

      /* Progress ring */
      .lvl-ring-wrap {
        flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 6px;
      }
      .lvl-ring { position: relative; width: 88px; height: 88px; }
      .lvl-ring svg { transform: rotate(-90deg); }
      .lvl-ring-bg { fill: none; stroke: var(--bg-elevated); stroke-width: 6; }
      .lvl-ring-fill {
        fill: none; stroke: var(--accent); stroke-width: 6; stroke-linecap: round;
        stroke-dasharray: ${ringCircumference.toFixed(1)};
        stroke-dashoffset: ${ringCircumference.toFixed(1)};
        transition: stroke-dashoffset 1.5s cubic-bezier(0.22,1,0.36,1);
      }
      .lvl-ring-text {
        position: absolute; inset: 0;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        font-family: var(--font-mono);
      }
      .lvl-ring-num { font-size: 1.5rem; font-weight: 800; color: var(--text-primary); line-height: 1; }
      .lvl-ring-label { font-size: 0.58rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }

      /* Skills row — attached to header */
      .lvl-skills-row {
        display: flex; gap: 7px; flex-wrap: wrap;
        padding: 0 0 24px 0;
        border-bottom: 1px solid var(--border);
        margin-bottom: 28px;
        animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.15s both;
        opacity: 0;
      }
      .lvl-skill-chip {
        font-family: var(--font-mono); font-size: 0.68rem; font-weight: 500;
        padding: 5px 12px; border-radius: 999px;
        background: var(--bg-elevated); color: var(--text-muted);
        border: 1px solid var(--border);
        display: flex; align-items: center; gap: 6px;
        transition: all 0.25s;
      }
      .lvl-skill-chip.chip-learned {
        background: var(--accent-tint); border-color: var(--border-accent); color: var(--accent);
      }
      .chip-check {
        width: 13px; height: 13px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 8px; flex-shrink: 0;
      }
      .chip-learned .chip-check { background: var(--accent); color: var(--text-inverse); }
      .lvl-skill-chip:not(.chip-learned) .chip-check { border: 1.5px solid var(--text-muted); }

      /* Section label */
      .lvl-section-label {
        font-family: var(--font-mono); font-size: 10px; font-weight: 600;
        letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted);
        margin-bottom: 12px;
      }

      /* Mission cards — vertical list */
      .lvl-missions-list { display: flex; flex-direction: column; gap: 8px; }
      .lvl-mission-card {
        display: grid;
        grid-template-columns: 36px 1fr auto;
        align-items: center;
        gap: 14px;
        padding: 16px 18px;
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: 14px;
        cursor: pointer; position: relative; overflow: hidden;
        transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
      }
      .lvl-card-stripe {
        position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
        background: var(--accent);
      }
      .lvl-card-stripe-done { background: var(--success); opacity: 0.5; }
      .lvl-card-active { border-color: var(--border-accent); }
      .lvl-card-done { border-color: var(--success-border); }
      .lvl-card-future .lvl-card-body,
      .lvl-card-future .lvl-card-action { opacity: 0.45; }
      .lvl-card-future .lvl-num-badge { opacity: 0.45; }

      /* Number badge */
      .lvl-num-badge {
        width: 36px; height: 36px; border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        font-family: var(--font-mono); font-weight: 700; font-size: 0.82rem;
        flex-shrink: 0; transition: all 0.2s;
      }
      .lvl-num-badge-active {
        background: var(--accent); color: var(--text-inverse);
        animation: badge-glow 3s ease-in-out infinite;
      }
      @keyframes badge-glow {
        0%,100% { box-shadow: 0 0 16px var(--accent-tint-strong); }
        50% { box-shadow: 0 0 24px rgba(200,255,0,0.25); }
      }
      .lvl-num-badge-done {
        background: var(--accent-tint); color: var(--accent); border: 1px solid var(--border-accent);
      }
      .lvl-num-badge-future {
        background: var(--bg-elevated); color: var(--text-muted); border: 1px solid var(--border);
      }

      /* Card body */
      .lvl-card-body { min-width: 0; }
      .lvl-card-title {
        font-family: var(--font-mono); font-size: 14px; font-weight: 700;
        color: var(--text-primary); margin-bottom: 3px; letter-spacing: -0.02em;
      }
      .lvl-card-desc {
        font-size: 12.5px; color: var(--text-secondary); line-height: 1.5;
        display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
        margin-bottom: 6px;
      }
      .lvl-card-tags { display: flex; gap: 5px; }
      .lvl-concept-tag {
        font-family: var(--font-mono); font-size: 9.5px; font-weight: 600;
        padding: 2px 8px; border-radius: 4px;
        background: var(--bg-elevated); color: var(--text-muted);
        border: 1px solid var(--border);
      }
      .lvl-concept-tag.tag-active {
        background: var(--accent); color: var(--text-inverse); border-color: var(--accent);
      }

      /* Card action */
      .lvl-card-action {
        display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0;
      }
      .lvl-diff-bars { display: flex; gap: 3px; align-items: flex-end; }
      .lvl-diff-bar {
        width: 3px; height: 14px; border-radius: 2px; background: var(--bg-elevated);
      }
      .lvl-diff-bar.bar-filled { background: var(--accent); opacity: 0.7; }

      .lvl-cta-btn {
        font-family: var(--font-mono); font-size: 12px; font-weight: 700;
        padding: 7px 16px; border-radius: var(--radius-sm);
        text-decoration: none; display: inline-flex; align-items: center; gap: 5px;
        white-space: nowrap; transition: all 0.15s; border: none; cursor: pointer;
      }
      .lvl-cta-start { background: var(--accent); color: var(--text-inverse); }
      .lvl-cta-start:hover { background: var(--accent-yellow-hover); transform: translateX(2px); }
      .lvl-cta-review {
        background: transparent; color: var(--text-secondary);
        border: 1px solid var(--border-hover);
      }
      .lvl-cta-review:hover { border-color: var(--text-secondary); color: var(--text-primary); }
      .lvl-cta-locked {
        background: var(--bg-elevated); color: var(--text-muted);
        border: 1px solid var(--border); cursor: default; width: 36px;
        justify-content: center; padding: 7px;
      }

      /* ─── Light mode overrides ─── */
      [data-theme="light"] .lvl-mission-card {
        border-color: transparent;
        box-shadow: var(--shadow-card);
      }
      [data-theme="light"] .lvl-mission-card.lvl-card-active {
        box-shadow: var(--shadow-card-active);
        border-color: transparent;
      }
      [data-theme="light"] .lvl-mission-card.lvl-card-done {
        border-color: transparent;
      }
      [data-theme="light"] .lvl-mission-card.lvl-card-future {
        box-shadow: none;
        background: var(--bg-card-locked);
      }
      [data-theme="light"] .lvl-skill-chip.chip-learned {
        background: var(--accent); color: #FFFFFF;
        border-color: var(--accent);
      }
      [data-theme="light"] .lvl-skill-chip.chip-learned .chip-check {
        background: #FFFFFF; color: var(--accent);
      }
      [data-theme="light"] .lvl-skill-chip:not(.chip-learned) {
        background: var(--bg-card); color: var(--text-muted);
        border: 1px solid rgba(0,0,0,0.08);
      }

      /* Lock gate banner */
      .lvl-lock-gate {
        margin-bottom: 2rem;
        background: rgba(251,191,36,0.06); border: 1px solid rgba(251,191,36,0.2);
        border-radius: var(--radius-lg); padding: 1.25rem 1.5rem;
        display: flex; align-items: center; gap: 1rem;
        animation: fadeUp 0.4s ease both;
      }
      .lvl-lock-icon {
        width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
        background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.25);
        display: flex; align-items: center; justify-content: center;
      }

      /* All complete banner */
      .lvl-complete-banner {
        margin-top: 2.5rem;
        background: var(--success-tint); border: 1px solid var(--success-border);
        border-radius: var(--radius-lg); padding: 1.5rem 2rem;
        display: flex; align-items: center; gap: 1rem;
        animation: fadeUp 0.5s ease both;
      }
      .lvl-complete-icon {
        width: 36px; height: 36px; border-radius: 50%;
        background: var(--success-dim); border: 1px solid var(--success-border);
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      }

      /* Responsive */
      @media (max-width: 640px) {
        .lvl-hero-inner { flex-direction: column; gap: 1.5rem; }
        .lvl-ring-wrap { flex-direction: row; align-self: flex-start; gap: 1rem; align-items: center; }
        .lvl-mission-card { grid-template-columns: 36px 1fr; gap: 10px; padding: 14px 14px; }
        .lvl-card-action { display: none; }
        .lvl-card-desc { -webkit-line-clamp: 2; }
      }
    </style>

    <div class="container" style="padding-top: 0; padding-bottom: 6rem;">

      <!-- Hero -->
      <section class="lvl-hero">
        <div class="lvl-hero-inner">
          <div class="lvl-hero-content">
            <div class="lvl-level-tag">Level ${String(levelId).padStart(2, '0')} &middot; ${LEVEL_NAMES[levelId] || 'Missions'}</div>
            <h1>${LEVEL_CONCEPTS_H1[levelId] || LEVEL_NAMES[levelId]}</h1>
            <p class="lvl-hero-desc">${LEVEL_DESCRIPTIONS[levelId] || 'Solve missions to learn SQL.'}</p>
          </div>
          <div class="lvl-ring-wrap">
            <div class="lvl-ring">
              <svg width="88" height="88" viewBox="0 0 88 88">
                <circle class="lvl-ring-bg" cx="44" cy="44" r="36"/>
                <circle class="lvl-ring-fill" id="lvl-progress-ring" cx="44" cy="44" r="36"/>
              </svg>
              <div class="lvl-ring-text">
                <span class="lvl-ring-num">${completedCount}</span>
                <span class="lvl-ring-label">of ${total}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Skills row -->
      <div class="lvl-skills-row">
        ${skillChips}
      </div>

      <!-- Lock gate banner -->
      ${locked && levelId > 1 ? (() => {
        const prevTotal = problems.filter(p => p.level === levelId - 1).length;
        const needed = Math.ceil(prevTotal * 0.8);
        return `
        <div class="lvl-lock-gate">
          <div class="lvl-lock-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div style="flex:1;">
            <div style="font-weight:700;color:var(--text-primary);margin-bottom:0.2rem;font-size:0.88rem;">Level ${levelId - 1} not yet 80% complete</div>
            <div style="font-size:0.78rem;color:var(--text-secondary);">Complete at least ${needed} of ${prevTotal} missions in Level ${levelId - 1} to unlock this level.</div>
          </div>
          <a href="#/level/${levelId - 1}" style="
            flex-shrink:0;display:inline-flex;align-items:center;gap:0.3rem;
            padding:0.45rem 1rem;border-radius:999px;
            font-family:var(--font-sans);font-size:0.78rem;font-weight:700;
            text-decoration:none;
            background:rgba(251,191,36,0.12);color:#ca8a04;
            border:1px solid rgba(251,191,36,0.25);
          ">Go back &rarr;</a>
        </div>`;
      })() : ''}

      <!-- Missions label -->
      <div class="lvl-section-label">Missions</div>

      <!-- Mission list -->
      <div class="lvl-missions-list" style="${locked ? 'pointer-events:none;opacity:0.45;' : ''}">
        ${cards}
      </div>

      <!-- All complete banner -->
      ${completedCount === total ? `
      <div class="lvl-complete-banner">
        <div class="lvl-complete-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div>
          <div style="font-weight:700;color:var(--text-primary);margin-bottom:0.2rem;">Level ${levelId} Cleared!</div>
          <div style="font-size:0.83rem;color:var(--text-secondary);">All missions complete. Ready for the next challenge.</div>
        </div>
        ${levelId < 10 ? `<a href="#/level/${levelId + 1}" style="
          margin-left:auto;
          display:inline-flex;align-items:center;gap:0.35rem;
          padding:0.5rem 1.25rem;border-radius:999px;
          font-family:var(--font-sans);font-size:0.82rem;font-weight:700;
          text-decoration:none;background:var(--accent);color:var(--text-inverse);
        ">Level ${levelId + 1} &rarr;</a>` : ''}
      </div>` : ''}

    </div>
  `;
}
