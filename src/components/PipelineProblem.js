export default function PipelineProblem(problem) {
  const scrambledHTML = problem.scrambled.map((step, idx) => `
    <div class="pp-dragger" draggable="true" data-text="${step.replace(/"/g, '&quot;')}">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
      <span>${step}</span>
    </div>
  `).join('');

  const dropzonesHTML = problem.correct.map((_, idx) => `
    <div class="pp-dropzone" data-index="${idx}">
      <div class="pp-dropzone-num">${idx + 1}</div>
      <div class="pp-dropzone-content">Drop step here</div>
    </div>
  `).join('');

  return `
    <style>
      .pp-container { display: flex; flex-direction: column; gap: 2rem; }
      .pp-query {
        background: var(--bg-card); border: 1px solid var(--border);
        border-radius: var(--radius-md); padding: 1.25rem;
        font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-primary);
        line-height: 1.5; white-space: pre-wrap;
      }
      
      .pp-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
      @media (max-width: 768px) { .pp-layout { grid-template-columns: 1fr; } }
      
      .pp-col-title {
        font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700;
        color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;
        margin-bottom: 1rem;
      }
      
      .pp-pool { 
        display: flex; flex-direction: column; gap: 8px; min-height: 200px; 
        padding: 10px; border: 1px dashed var(--border); border-radius: var(--radius-md); 
        background: var(--bg-elevated); 
      }
      .pp-target { display: flex; flex-direction: column; gap: 8px; }
      
      .pp-dragger {
        background: var(--bg-card); border: 1px solid var(--border);
        border-radius: var(--radius-sm); padding: 12px 14px;
        display: flex; align-items: center; gap: 10px;
        font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-primary);
        cursor: grab; transition: transform 0.15s, box-shadow 0.15s;
        user-select: none;
      }
      .pp-dragger:active { cursor: grabbing; transform: scale(0.98); }
      .pp-dragger.dragging { opacity: 0.5; }
      .pp-dragger svg { color: var(--text-muted); }
      
      .pp-dropzone {
        background: var(--bg-elevated); border: 1px dashed var(--border);
        border-radius: var(--radius-sm); min-height: 48px;
        display: flex; align-items: center; gap: 10px; padding: 0 14px;
        transition: background 0.2s, border-color 0.2s;
      }
      .pp-dropzone.drag-over { background: var(--accent-tint); border-color: var(--accent); border-style: solid; box-shadow: inset 0 0 0 1px var(--accent); }
      .pp-dropzone.filled { background: var(--bg-card); border: 1px solid var(--border); border-style: solid; padding: 0; box-shadow: none; }
      .pp-dropzone-num {
        width: 24px; height: 24px; border-radius: 4px; background: var(--bg-page);
        display: flex; align-items: center; justify-content: center;
        font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; color: var(--text-muted);
      }
      .pp-dropzone.filled .pp-dropzone-num { display: none; }
      .pp-dropzone-content { font-family: var(--font-sans); font-size: 0.85rem; color: var(--text-muted); font-style: italic; }
      .pp-dropzone.filled .pp-dropzone-content { display: none; }

      .pp-feedback { margin-top: 1.5rem; padding: 1rem; border-radius: var(--radius-md); display: none; line-height: 1.5; font-size: 0.9rem; }
      .pp-feedback.success { display: block; background: var(--success-tint); border: 1px solid var(--success-border); color: var(--success); }
      .pp-feedback.error { display: block; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: var(--error); }
      
      /* Reset full border radius for dragger inside dropzone */
      .pp-dropzone.filled .pp-dragger { border: none; width: 100%; border-radius: var(--radius-sm); margin: -1px; }

      [data-theme="light"] .pp-dragger { box-shadow: var(--shadow-sm); border-color: transparent; }
      [data-theme="light"] .pp-dropzone.filled { box-shadow: var(--shadow-sm); border-color: transparent; }
    </style>
    <div class="pp-container" id="pp-container">
      <div>
        <div class="pp-col-title">Query to Analyze</div>
        <div class="pp-query">${problem.query.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
      </div>
      <div class="pp-layout">
        <div>
          <div class="pp-col-title">Execution Steps</div>
          <div class="pp-pool" id="pp-pool">
            ${scrambledHTML}
          </div>
        </div>
        <div>
          <div class="pp-col-title">Correct Order</div>
          <div class="pp-target" id="pp-target">
            ${dropzonesHTML}
          </div>
        </div>
      </div>
      <div id="pp-feedback" class="pp-feedback"></div>
      <div>
        <button id="pp-check-btn" class="btn btn-primary" style="width:100%;font-size:1rem;height:44px;">Check Execution Order</button>
      </div>
    </div>
  `;
}

export function bindPipelineProblem(problem, onComplete) {
  const pool = document.getElementById('pp-pool');
  const target = document.getElementById('pp-target');
  const checkBtn = document.getElementById('pp-check-btn');
  const feedback = document.getElementById('pp-feedback');
  
  if (!pool || !target || !checkBtn) return;
  
  let draggedItem = null;
  let sourceZone = null;
  
  // Draggables
  document.querySelectorAll('.pp-dragger').forEach(item => {
    item.addEventListener('dragstart', (e) => {
      draggedItem = item;
      sourceZone = item.parentElement;
      setTimeout(() => item.classList.add('dragging'), 0);
    });
    item.addEventListener('dragend', () => {
      setTimeout(() => {
        if (draggedItem) {
          draggedItem.classList.remove('dragging');
        }
        draggedItem = null;
        sourceZone = null;
      }, 0);
      
      // Cleanup empty dropzones
      document.querySelectorAll('.pp-dropzone').forEach(dz => {
        if (!dz.querySelector('.pp-dragger')) {
          dz.classList.remove('filled');
        }
      });
    });
  });
  
  // Dropzones (and pool)
  const dropzones = document.querySelectorAll('.pp-dropzone');
  
  [...dropzones, pool].forEach(zone => {
    zone.addEventListener('dragover', e => {
      e.preventDefault();
      // Only show over state if it's a dropzone and it's empty
      if (zone.classList.contains('pp-dropzone') && !zone.querySelector('.pp-dragger') && draggedItem) {
        zone.classList.add('drag-over');
      }
    });
    
    zone.addEventListener('dragleave', () => {
      zone.classList.remove('drag-over');
    });
    
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      
      if (!draggedItem) return;
      
      if (zone === pool) {
        pool.appendChild(draggedItem);
      } else if (zone.classList.contains('pp-dropzone')) {
        const existing = zone.querySelector('.pp-dragger');
        if (existing) {
          // Swap logic: if dropping on a filled zone, move the existing one back to where the dragged item came from
          if (sourceZone) {
            sourceZone.appendChild(existing);
            if (sourceZone.classList.contains('pp-dropzone')) {
              sourceZone.classList.add('filled');
            }
          } else {
            pool.appendChild(existing); 
          }
        }
        zone.appendChild(draggedItem);
        zone.classList.add('filled');
      }
      
      // Cleanup all zones
      dropzones.forEach(dz => {
        if (!dz.querySelector('.pp-dragger')) dz.classList.remove('filled');
        else dz.classList.add('filled');
      });
    });
  });
  
  checkBtn.addEventListener('click', () => {
    feedback.className = 'pp-feedback';
    feedback.innerHTML = '';
    
    // Validate order
    const currentOrder = Array.from(dropzones).map(dz => {
      const dragger = dz.querySelector('.pp-dragger');
      return dragger ? dragger.getAttribute('data-text') : null;
    });
    
    if (currentOrder.includes(null)) {
      feedback.classList.add('error');
      feedback.innerHTML = '<strong>Incomplete:</strong> Please place all steps in the correct order.';
      return;
    }
    
    let isCorrect = true;
    for (let i = 0; i < problem.correct.length; i++) {
      if (currentOrder[i] !== problem.correct[i]) {
        isCorrect = false;
        break;
      }
    }
    
    if (isCorrect) {
      feedback.classList.remove('error');
      feedback.classList.add('success');
      feedback.innerHTML = `<strong>Correct!</strong> ${problem.debrief || 'Excellent. You understand the execution pipeline.'}`;
      // Tell parent exactly what's needed
      checkBtn.style.display = 'none';
      if (onComplete) onComplete();
    } else {
      feedback.classList.remove('success');
      feedback.classList.add('error');
      feedback.innerHTML = '<strong>Incorrect order:</strong> That is not how the database executes this query. Try again.';
    }
  });
}
