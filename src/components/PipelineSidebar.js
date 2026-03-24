export const PIPELINE_STEPS = [
  { id: 'step-0', name: 'CTE', desc: 'Runs isolated' },
  { id: 'step-1', name: 'FROM', desc: 'Picks the table(s)' },
  { id: 'step-2', name: 'WHERE', desc: 'Filters rows' },
  { id: 'step-3', name: 'GROUP BY', desc: 'Sets groups' },
  { id: 'step-4', name: 'HAVING', desc: 'Filters groups' },
  { id: 'step-window', name: 'WINDOW', desc: 'Row analytics' },
  { id: 'step-5', name: 'SELECT', desc: 'Picks columns' },
  { id: 'step-6', name: 'ORDER BY', desc: 'Sorts rows' },
  { id: 'step-7', name: 'LIMIT', desc: 'Caps rows' }
];

export const PIPELINE_VISIBILITY = {
  1: ['step-1', 'step-5'],
  2: ['step-1', 'step-2', 'step-5'],
  3: ['step-1', 'step-2', 'step-5', 'step-6', 'step-7'],
  4: ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7'],
  5: ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7'],
  6: ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7'],
  7: ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7'],
  8: ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7'],
  9: ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7'],
  10:['step-0', 'step-1', 'step-2', 'step-3', 'step-4', 'step-window', 'step-5', 'step-6', 'step-7']
};

export const PIPELINE_HIGHLIGHTS = {
  1: ['step-1', 'step-5'],
  2: ['step-2'],
  3: ['step-6', 'step-7'],
  4: ['step-3', 'step-4'],
  5: ['step-1'], // JOIN
  6: [],
  7: [], 
  8: [],
  9: [],
  10:['step-0', 'step-window'] // CTE and Window
};

export default function PipelineSidebar(levelId, activeProblem = null) {
  const visible = PIPELINE_VISIBILITY[levelId] || PIPELINE_VISIBILITY[10];
  const highlights = PIPELINE_HIGHLIGHTS[levelId] || [];
  
  const stepsHTML = PIPELINE_STEPS.filter(s => visible.includes(s.id)).map((step, idx) => {
    let name = step.name;
    if (step.id === 'step-1' && levelId >= 5) name = 'FROM / JOIN';
    
    const isNew = highlights.includes(step.id);
    const highlightClass = isNew ? 'pipe-step-hilight' : '';
    
    return `
      <div class="pipe-step ${highlightClass}">
        <div class="pipe-num">${idx + 1}</div>
        <div class="pipe-info">
          <div class="pipe-name">${name}</div>
          <div class="pipe-desc">${step.desc}</div>
        </div>
      </div>
    `;
  }).join('');
  
  let calloutHTML = '';
  if (activeProblem && activeProblem.pipelineCallout) {
    calloutHTML = `
      <div class="pipe-callout">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        ${activeProblem.pipelineCallout}
      </div>
    `;
  }

  return `
    <style>
      .pipeline-widget {
        background: var(--bg-card);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        border: 1px solid var(--border);
      }
      .pipeline-header {
        font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700;
        color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em;
        margin-bottom: 1.5rem;
      }
      .pipeline-body { position: relative; padding-left: 6px; }
      .pipeline-line {
        position: absolute; left: 14px; top: 12px; bottom: 12px; width: 2px;
        background: var(--bg-elevated); border-radius: 1px;
      }
      .pipeline-steps { display: flex; flex-direction: column; gap: 1.1rem; }
      .pipe-step { display: flex; align-items: flex-start; gap: 14px; position: relative; z-index: 1; }
      .pipe-num {
        width: 18px; height: 18px; border-radius: 50%;
        background: var(--bg-card); border: 2px solid var(--border);
        display: flex; align-items: center; justify-content: center;
        font-family: var(--font-mono); font-size: 0.6rem; font-weight: 800;
        color: var(--text-muted); flex-shrink: 0; margin-top: 1px;
        transition: all 0.3s; box-sizing: content-box;
      }
      .pipe-info { flex: 1; }
      .pipe-name {
        font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700;
        color: var(--text-primary); margin-bottom: 2px;
        letter-spacing: -0.02em;
      }
      .pipe-desc { font-size: 0.72rem; color: var(--text-secondary); line-height: 1.3; }
      
      .pipe-step-hilight .pipe-num {
        border-color: var(--accent); color: var(--accent);
        box-shadow: 0 0 10px var(--accent-tint-strong);
      }
      .pipe-step-hilight .pipe-name { color: var(--accent); }

      .pipe-callout {
        margin-top: 1.5rem; padding: 1rem;
        background: var(--bg-elevated); border-radius: var(--radius-md);
        border: 1px solid var(--border);
        font-size: 0.75rem; color: var(--text-secondary); line-height: 1.5;
        position: relative;
      }
      .pipe-callout svg {
        color: var(--accent); position: absolute; left: 1rem; top: 1.1rem;
      }
      .pipe-callout { padding-left: 2.5rem; }
      
      [data-theme="light"] .pipeline-widget { border-color: transparent; box-shadow: var(--shadow-card); }
    </style>
    <div class="pipeline-widget">
      <div class="pipeline-header">Execution Pipeline</div>
      <div class="pipeline-body">
        <div class="pipeline-line"></div>
        <div class="pipeline-steps">
          ${stepsHTML}
        </div>
      </div>
      ${calloutHTML}
    </div>
  `;
}
