import { initEditor, getEditorValue, setEditorValue } from '../components/Editor.js';
import { renderResultsTable } from '../components/ResultsTable.js';
import { renderDatasetExplorer } from '../components/DatasetExplorer.js';
import { renderHintPanel } from '../components/HintPanel.js';
import { initDatabase, executeQuery, validateResult, checkConcept } from '../engine/sqlEngine.js';
import problems from '../data/problems.json';

export default function LessonPage() {
  const hash = window.location.hash;
  const lessonId = hash.split('/').pop() || 'L1_P1';
  const problem = problems.find(p => p.id === lessonId);
  
  if (!problem) {
    return `<div class="container mt-8"><h3>Problem not found</h3></div>`;
  }

  let failedAttempts = 0;

  // Since our router simply sets InnerHTML right now, we need a small setTimeout 
  // or logic to wait for DOM to be ready before calling init functions
  setTimeout(async () => {
    try {
      await initDatabase();
      renderDatasetExplorer('dataset-explorer-container');
      renderHintPanel('hint-container', problem, failedAttempts, (answer) => {
        setEditorValue(answer);
      });
      
      initEditor('editor-container', '', () => {
        document.getElementById('run-btn').click();
      });

      document.getElementById('run-btn').addEventListener('click', handleRun);
    } catch (e) {
      console.error("Setup error", e);
      document.getElementById('dataset-explorer-container').innerHTML = `
        <div style="color:red; padding: 1rem;">
           <strong>Setup Error:</strong> ${e.toString()}
           <br><br>
           ${e.stack || ''}
        </div>
      `;
    }
  }, 50);

  function handleRun() {
    const sql = getEditorValue();
    const result = executeQuery(sql);
    renderResultsTable('results-container', result);

    const feedbackEl = document.getElementById('feedback-container');
    
    const editorCard = document.getElementById('editor-card');

    if (result.error) {
      failedAttempts++;
      if (editorCard) editorCard.style.borderColor = '';
      feedbackEl.innerHTML = `<div style="margin-top: 0.75rem; background: var(--error-dim); border: 1px solid rgba(239,68,68,0.25); border-radius: var(--radius-md); padding: 0.75rem 1rem; color: var(--error); font-size: 0.85rem;"><span style="font-family: var(--font-mono);">SyntaxError:</span> Check results panel for details.</div>`;
      renderHintPanel('hint-container', problem, failedAttempts, (ans) => setEditorValue(ans));
      return;
    }

    if (!checkConcept(sql, problem.requiredConcept)) {
      failedAttempts++;
      if (editorCard) editorCard.style.borderColor = '';
      feedbackEl.innerHTML = `<div style="margin-top: 0.75rem; background: var(--error-dim); border: 1px solid rgba(239,68,68,0.25); border-radius: var(--radius-md); padding: 0.75rem 1rem; color: var(--error); font-size: 0.85rem;">You must use the <span style="font-family: var(--font-mono); background: rgba(239,68,68,0.2); padding: 0.1rem 0.3rem; border-radius: 4px;">${problem.requiredConcept}</span> keyword.</div>`;
      renderHintPanel('hint-container', problem, failedAttempts, (ans) => setEditorValue(ans));
      return;
    }

    const isCorrect = validateResult(result, problem.expectedOutput);
    if (isCorrect) {
      if (editorCard) editorCard.style.borderColor = 'rgba(34, 197, 94, 0.5)';

      feedbackEl.innerHTML = `
        <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem; padding: 0.25rem 0;">
            <div style="width: 26px; height: 26px; border-radius: 50%; background: #4ade80; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">Correct query!</span>
          </div>
          <a href="#/level/${problem.level}" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 0.875rem; font-size: 1rem; border-radius: var(--radius-full);">Continue &rarr;</a>
        </div>
      `;
    } else {
      failedAttempts++;
      if (editorCard) editorCard.style.borderColor = '';
      feedbackEl.innerHTML = `<div style="margin-top: 0.75rem; background: var(--error-dim); border: 1px solid rgba(239,68,68,0.25); border-radius: var(--radius-md); padding: 0.75rem 1rem; color: var(--error); font-size: 0.85rem;">Results don't match the expected output. Try again!</div>`;
      renderHintPanel('hint-container', problem, failedAttempts, (ans) => setEditorValue(ans));
    }
  }

  return `
    <div class="lesson-layout">
      <!-- Left Panel: Context -->
      <div class="card" style="display: flex; flex-direction: column; gap: 1rem; position: sticky; top: 1.5rem;">
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <a href="#/level/${problem.level}" style="color: var(--text-secondary); text-decoration: none; font-size: 0.875rem;">&larr; Back to Level</a>
            <div style="padding: 0.2rem 0.65rem; background: var(--bg-elevated); border-radius: var(--radius-full); font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary);">Level ${problem.level}</div>
          </div>
          <h3 style="font-size: 1.75rem; margin-bottom: 1rem; line-height: 1.25;">${problem.title}</h3>

          <div style="background: var(--bg-elevated); padding: 1rem; border-radius: var(--radius-md); font-size: 0.95rem; line-height: 1.7; color: var(--text-primary);">
            ${problem.story}
          </div>
        </div>
        
        <div id="hint-container" style="flexShrink: 0;"></div>
      </div>
      
      <!-- Middle Panel: Editor & Results -->
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div id="editor-card" class="card-dark" style="display: flex; flex-direction: column;">
          <div class="flex justify-between items-center mb-4">
            <h4 style="color: #9CA3AF; margin: 0; font-size: 0.9rem; font-weight: 500;">Query Editor</h4>
            <button id="run-btn" class="btn btn-primary">Run Query (⌘+Enter)</button>
          </div>
          <div id="editor-container" style="height: 240px; background: #1a1a1a; border-radius: var(--radius-md); overflow: hidden;">
            <!-- Monaco will go here -->
          </div>
          <div id="feedback-container"></div>
        </div>
        
        <div class="card" style="display: flex; flex-direction: column;">
          <h4 style="color: var(--text-secondary); margin-bottom: 0.75rem; margin-top: 0; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em;">Results</h4>
          <div id="results-container" style="min-width: 0;">
             <p style="color: var(--text-secondary); text-align: center; margin-top: 3rem; font-size: 0.9rem;">Run a query to see results</p>
          </div>
        </div>
      </div>
      
      <!-- Right Panel: Dataset Explorer -->
      <div class="card" style="position: sticky; top: 1.5rem;">
        <div id="dataset-explorer-container"></div>
      </div>
    </div>
  `;
}
