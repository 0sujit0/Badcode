import problems from '../data/problems.json';
import { getProblemStatus } from '../store/progress.js';

export default function LevelPage() {
  const hash = window.location.hash;
  const levelId = parseInt(hash.split('/').pop(), 10);

  const levelProblems = problems.filter(p => p.level === levelId);
  if (levelProblems.length === 0) {
    return `<div class="container" style="padding-top:4rem;color:var(--text-secondary);">Level not found.</div>`;
  }

  const levelNames = {
    1: 'Foundations', 2: 'Querying Basics', 3: 'Filtering & Sorting',
    4: 'Aggregation',  5: 'Joins',           6: 'Data Manipulation',
    7: 'Functions',    8: 'Advanced SQL',
  };

  // Progress calculation
  const completedCount = levelProblems.filter(p => getProblemStatus(p.id).completed).length;
  const total = levelProblems.length;
  const pct = Math.round((completedCount / total) * 100);

  // ─── Determine card state ────────────────────────────────────────
  // Active = first non-completed unlocked problem
  let activeIndex = -1;
  for (let i = 0; i < levelProblems.length; i++) {
    if (!getProblemStatus(levelProblems[i].id).completed) {
      activeIndex = i;
      break;
    }
  }
  if (completedCount === total) activeIndex = -1; // all done

  // ─── Mission Cards ───────────────────────────────────────────────
  const cards = levelProblems.map((p, i) => {
    const status = getProblemStatus(p.id);
    const isCompleted = status.completed;
    const isActive    = i === activeIndex;
    const isLocked    = false;
    const cleanStory  = p.story.replace(/<[^>]*>?/gm, '');

    /* ── Card variables for each state ── */
    let cardBg         = 'var(--bg-card)';
    let cardBorder     = '1px solid var(--border)';
    let cardOpacity    = '1';
    let badgeStyle     = `background:var(--bg-elevated);color:var(--text-muted);border:1px solid var(--border);`;
    let titleStyle     = `color:var(--text-primary);`;
    let descStyle      = `color:var(--text-secondary);`;
    let glowStyle      = '';
    let statusBadge    = '';

    if (isCompleted) {
      cardBorder   = '1px solid rgba(74,222,128,0.25)';
      badgeStyle   = `background:rgba(74,222,128,0.15);color:var(--success);border:1px solid rgba(74,222,128,0.3);`;
      statusBadge  = `<span style="display:inline-flex;align-items:center;gap:0.3rem;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--success);background:rgba(74,222,128,0.1);padding:0.18rem 0.55rem;border-radius:999px;">
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>
        Done
      </span>`;
    } else if (isActive) {
      cardBg       = 'var(--bg-card)';
      cardBorder   = '1px solid var(--border-accent)';
      glowStyle    = 'box-shadow: 0 0 0 1px var(--border-accent), 0 8px 32px rgba(200,245,66,0.06);';
      badgeStyle   = `background:var(--accent);color:var(--text-inverse);border:none;font-weight:800;`;
    } else {
      /* locked */
      cardOpacity  = '0.45';
    }

    /* ── Number / check badge ── */
    const badgeContent = isCompleted
      ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>`
      : isLocked
        ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
        : `${i + 1}`;

    /* ── CTA Button ── */
    let ctaBtn = '';
    if (isActive) {
      ctaBtn = `<a href="#/lesson/${p.id}" onclick="event.stopPropagation()" style="
        display:inline-flex;align-items:center;gap:0.35rem;
        padding:0.45rem 1.1rem;border-radius:999px;
        font-family:var(--font-sans);font-size:0.82rem;font-weight:700;
        text-decoration:none;
        background:var(--accent);color:var(--text-inverse);
        transition:background 0.15s,transform 0.15s;
      " onmouseenter="this.style.background='var(--accent-yellow-hover)';this.style.transform='scale(1.03)'"
         onmouseleave="this.style.background='var(--accent)';this.style.transform='scale(1)'">
        Start
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>`;
    } else if (!isCompleted) {
      ctaBtn = `<a href="#/lesson/${p.id}" onclick="event.stopPropagation()" style="
        display:inline-flex;align-items:center;gap:0.35rem;
        padding:0.45rem 1.1rem;border-radius:999px;
        font-family:var(--font-sans);font-size:0.82rem;font-weight:700;
        text-decoration:none;
        background:transparent;color:var(--text-secondary);
        border:1px solid var(--border-hover);
        transition:border-color 0.15s,color 0.15s;
      " onmouseenter="this.style.borderColor='var(--text-secondary)';this.style.color='var(--text-primary)'"
         onmouseleave="this.style.borderColor='var(--border-hover)';this.style.color='var(--text-secondary)'">
        Start
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>`;
    } else if (isCompleted) {
      ctaBtn = `<a href="#/lesson/${p.id}" onclick="event.stopPropagation()" style="
        display:inline-flex;align-items:center;gap:0.3rem;
        padding:0.38rem 0.9rem;border-radius:999px;
        font-family:var(--font-sans);font-size:0.78rem;font-weight:600;
        text-decoration:none;
        background:transparent;color:var(--text-secondary);
        border:1px solid var(--border-hover);
        transition:border-color 0.15s,color 0.15s;
      " onmouseenter="this.style.borderColor='var(--text-secondary)';this.style.color='var(--text-primary)'"
         onmouseleave="this.style.borderColor='var(--border-hover)';this.style.color='var(--text-secondary)'">
        Review
      </a>`;
    }

    /* ── Hover events (only non-locked) ── */
    const hoverEvents = !isLocked ? `
      onmouseenter="if(this.dataset.active!='true'){this.style.borderColor='var(--border-hover)';this.style.background='var(--bg-card-hover)';this.style.transform='translateY(-2px)';}"
      onmouseleave="if(this.dataset.active!='true'){this.style.borderColor='${isCompleted ? 'rgba(74,222,128,0.25)' : 'var(--border)'}';this.style.background='var(--bg-card)';this.style.transform='translateY(0)';}"
    ` : '';
    const activeDataAttr = isActive ? `data-active="true"` : '';

    return `
      <div
        ${activeDataAttr}
        style="
          background:${cardBg};
          border:${cardBorder};
          ${glowStyle}
          border-radius:14px;
          padding:1.5rem 1.75rem;
          display:flex;flex-direction:column;gap:1.1rem;
          cursor:${isLocked ? 'default' : 'pointer'};
          opacity:${cardOpacity};
          transition:border-color 0.2s,background 0.2s,transform 0.2s,box-shadow 0.2s;
          animation:fadeUp 0.4s ease ${i * 60}ms both;
          position:relative;overflow:hidden;
        "
        ${!isLocked ? `onclick="window.location.hash='#/lesson/${p.id}'"` : ''}
        ${hoverEvents}
      >
        ${isActive ? `<div style="
          position:absolute;top:0;left:0;right:0;height:2px;
          background:var(--accent);
          border-radius:14px 14px 0 0;
        "></div>` : ''}

        <!-- Row 1: badge + status -->
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="
            width:28px;height:28px;border-radius:50%;
            ${badgeStyle}
            display:flex;align-items:center;justify-content:center;
            font-family:var(--font-mono);font-size:0.78rem;font-weight:700;
            flex-shrink:0;
          ">${badgeContent}</div>
          ${statusBadge}
        </div>

        <!-- Row 2: title + description -->
        <div style="flex:1;">
          <h3 style="
            font-family:var(--font-sans);font-size:0.95rem;font-weight:600;
            ${titleStyle}
            margin-bottom:0.45rem;line-height:1.35;letter-spacing:-0.01em;
          ">${p.title}</h3>
          <p style="
            ${descStyle}font-size:0.83rem;line-height:1.6;
            display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;
          ">${cleanStory}</p>
        </div>

        <!-- Row 3: concept tag + CTA -->
        <div style="
          display:flex;align-items:center;justify-content:space-between;
          padding-top:0.9rem;border-top:1px solid var(--border);
          margin-top:auto;
        ">
          <code style="
            font-family:var(--font-mono);font-size:0.72rem;font-weight:600;
            color:${isActive ? '#1A2200' : 'var(--text-muted)'};
            background:${isActive ? '#C8F542' : 'var(--bg-elevated)'};
            padding:0.18rem 0.5rem;border-radius:4px;
            border:1px solid ${isActive ? '#B0D930' : 'var(--border)'};
          ">${p.requiredConcept}</code>
          ${ctaBtn}
        </div>
      </div>
    `;
  }).join('');

  // ─── Progress segments ───────────────────────────────────────────
  const segments = levelProblems.map((p, i) => {
    const done = getProblemStatus(p.id).completed;
    return `<div style="
      flex:1;height:3px;border-radius:2px;
      background:${done ? 'var(--accent)' : i === activeIndex ? 'rgba(200,245,66,0.25)' : 'var(--border)'};
      transition:background 0.3s ${i * 60}ms;
    "></div>`;
  }).join('');

  return `
    <style>
      @keyframes fadeUp {
        from { opacity:0; transform:translateY(14px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes subtlePulse {
        0%,100% { box-shadow: 0 0 0 1px var(--border-accent), 0 8px 32px rgba(200,245,66,0.06); }
        50%      { box-shadow: 0 0 0 1px var(--border-accent), 0 8px 40px rgba(200,245,66,0.14); }
      }
      [data-active="true"] { animation: fadeUp 0.4s ease both, subtlePulse 3s ease 1s infinite !important; }
    </style>

    <div class="container" style="padding-top:2.5rem;padding-bottom:6rem;">

      <!-- Back link -->
      <a href="#/dashboard" style="
        display:inline-flex;align-items:center;gap:0.4rem;
        text-decoration:none;
        color:var(--text-muted);
        font-size:0.8rem;font-weight:500;
        margin-bottom:2.5rem;
        transition:color 0.15s;
      " onmouseenter="this.style.color='var(--text-secondary)'"
         onmouseleave="this.style.color='var(--text-muted)'">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to Dashboard
      </a>

      <!-- Hero banner -->
      <div style="
        background:linear-gradient(135deg,#111115 0%,#16161C 100%);
        border:1px solid rgba(255,255,255,0.07);
        border-radius:20px;
        padding:2.5rem 3rem;
        margin-bottom:2rem;
        position:relative;overflow:hidden;
        animation:fadeUp 0.4s ease both;
      ">
        <!-- Subtle grid texture -->
        <div style="
          position:absolute;inset:0;
          background-image:radial-gradient(circle,rgba(200,245,66,0.03) 1px,transparent 1px);
          background-size:24px 24px;pointer-events:none;
        "></div>
        <!-- Accent glow top right -->
        <div style="position:absolute;top:-40px;right:-40px;width:200px;height:200px;
          background:radial-gradient(circle,rgba(200,245,66,0.06) 0%,transparent 70%);
          pointer-events:none;"></div>

        <div style="position:relative;">
          <!-- Level pill -->
          <div style="
            display:inline-block;
            font-family:var(--font-mono);font-size:0.68rem;font-weight:700;
            text-transform:uppercase;letter-spacing:0.12em;
            color:var(--text-inverse);background:var(--accent);
            padding:0.22rem 0.75rem;border-radius:999px;
            margin-bottom:1.1rem;
          ">LVL ${levelId} · ${(levelNames[levelId] || 'missions').toUpperCase()}</div>

          <h1 style="
            font-family:var(--font-sans);
            font-size:clamp(1.8rem, 4vw, 2.6rem);
            font-weight:700;font-style:normal;
            color:#E8E6E3;
            letter-spacing:-0.03em;
            margin-bottom:0.5rem;line-height:1.1;
          ">${levelNames[levelId] || 'Level ' + levelId} Missions</h1>

          <p style="color:#9A9898;font-size:0.9rem;max-width:480px;line-height:1.65;margin-bottom:0;">
            Solve real business data requests to earn your rank. Each mission unlocks the next.
          </p>
        </div>
      </div>

      <!-- Progress bar -->
      <div style="margin-bottom:2.5rem;animation:fadeUp 0.4s ease 0.1s both;">
        <div style="
          display:flex;align-items:center;justify-content:space-between;
          margin-bottom:0.6rem;
        ">
          <span style="font-family:var(--font-mono);font-size:0.72rem;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;">
            Progress
          </span>
          <span style="font-family:var(--font-mono);font-size:0.72rem;font-weight:700;color:${completedCount > 0 ? 'var(--accent)' : 'var(--text-muted)'};">
            ${completedCount} / ${total} completed
          </span>
        </div>
        <!-- Segmented bar -->
        <div style="display:flex;gap:3px;">
          ${segments}
        </div>
      </div>

      <!-- Mission grid -->
      <div class="grid-missions">
        ${cards}
      </div>

      ${completedCount === total ? `
      <!-- All complete banner -->
      <div style="
        margin-top:3rem;
        background:rgba(74,222,128,0.06);
        border:1px solid rgba(74,222,128,0.2);
        border-radius:14px;
        padding:1.5rem 2rem;
        display:flex;align-items:center;gap:1rem;
        animation:fadeUp 0.5s ease both;
      ">
        <div style="
          width:36px;height:36px;border-radius:50%;
          background:rgba(74,222,128,0.15);
          border:1px solid rgba(74,222,128,0.3);
          display:flex;align-items:center;justify-content:center;
          flex-shrink:0;
        "><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
        <div>
          <div style="font-weight:700;color:var(--text-primary);margin-bottom:0.2rem;">Level ${levelId} Cleared!</div>
          <div style="font-size:0.83rem;color:var(--text-secondary);">All missions complete. Ready for the next challenge.</div>
        </div>
        ${levelId < 8 ? `<a href="#/level/${levelId + 1}" style="
          margin-left:auto;
          display:inline-flex;align-items:center;gap:0.35rem;
          padding:0.5rem 1.25rem;border-radius:999px;
          font-family:var(--font-sans);font-size:0.82rem;font-weight:700;
          text-decoration:none;background:var(--accent);color:var(--text-inverse);
        ">Level ${levelId + 1} →</a>` : ''}
      </div>` : ''}

    </div>
  `;
}
