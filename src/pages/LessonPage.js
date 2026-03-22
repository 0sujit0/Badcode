import { initEditor, getEditorValue, setEditorValue } from '../components/Editor.js';
import { renderResultsTable } from '../components/ResultsTable.js';
import { renderDatasetExplorer } from '../components/DatasetExplorer.js';
import { renderHintPanel } from '../components/HintPanel.js';
import { initDatabase, executeQuery, validateResultDetailed, checkConcept } from '../engine/sqlEngine.js';
import { saveLocalProgress } from '../store/progress.js';
import { isAIEnabled } from '../ai/aiToggle.js';
import { getCoachResponse } from '../ai/aiCoach.js';
import problems from '../data/problems.json';

export default function LessonPage() {
  const hash = window.location.hash;
  const lessonId = hash.split('/').pop() || 'L1_P1';
  const problem = problems.find(p => p.id === lessonId);
  
  if (!problem) {
    return `<div class="container mt-8"><h3>Problem not found</h3></div>`;
  }

  // Determine next problem or level-complete destination
  const levelProblems = problems.filter(p => p.level === problem.level).sort((a, b) => a.id.localeCompare(b.id));
  const currentIndex = levelProblems.findIndex(p => p.id === problem.id);
  const isLastProblem = currentIndex === levelProblems.length - 1;
  const nextProblemId = !isLastProblem ? levelProblems[currentIndex + 1].id : null;

  let failedAttempts = 0;

  // Use double-rAF to ensure the router's innerHTML is fully painted before
  // we run DOM queries and mount Monaco.
  requestAnimationFrame(() => requestAnimationFrame(async () => {
    const editorContainer = document.getElementById('editor-container');
    if (editorContainer) {
      editorContainer.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:100%;gap:0.6rem;color:var(--text-muted);font-size:0.85rem;">
          <span class="coach-spinner"></span> Initializing SQL engine…
        </div>
      `;
    }

    try {
      await initDatabase();
      renderDatasetExplorer('dataset-explorer-container');
      renderHintPanel('hint-container', problem, failedAttempts, (answer) => {
        setEditorValue(answer);
      });

      const starterQuery = problem.starterQuery || '';
      initEditor('editor-container', starterQuery, () => {
        document.getElementById('run-btn').click();
      });

      document.getElementById('run-btn').addEventListener('click', handleRun);
    } catch (e) {
      console.error("Setup error", e);
      document.getElementById('dataset-explorer-container').innerHTML = `
        <div style="color:var(--error); padding: 1rem;">
           <strong>Setup Error:</strong> ${e.toString()}
           <br><br>
           ${e.stack || ''}
        </div>
      `;
    }
  }));

  async function handleRun() {
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
      maybeShowAICoach(sql, 'syntax_error', result);
      return;
    }

    if (!checkConcept(sql, problem.requiredConcept)) {
      failedAttempts++;
      if (editorCard) editorCard.style.borderColor = '';
      feedbackEl.innerHTML = `<div style="margin-top: 0.75rem; background: var(--error-dim); border: 1px solid rgba(239,68,68,0.25); border-radius: var(--radius-md); padding: 0.75rem 1rem; color: var(--error); font-size: 0.85rem;">You must use the <span style="font-family: var(--font-mono); background: rgba(239,68,68,0.2); padding: 0.1rem 0.3rem; border-radius: 4px;">${problem.requiredConcept}</span> keyword.</div>`;
      renderHintPanel('hint-container', problem, failedAttempts, (ans) => setEditorValue(ans));
      maybeShowAICoach(sql, 'missing_concept', result);
      return;
    }

    const validation = validateResultDetailed(result, problem.expectedOutput);

    if (validation.verdict === 'correct') {
      if (editorCard) editorCard.style.borderColor = 'rgba(34, 197, 94, 0.5)';

      // Save progress to localStorage
      saveLocalProgress(problem.id, {
        completed: true,
        withAssist: failedAttempts > 0,
        attempts: failedAttempts + 1
      });

      // Determine Continue destination
      const continueHref = isLastProblem
        ? `#/level-complete/${problem.level}`
        : `#/lesson/${nextProblemId}`;

      feedbackEl.innerHTML = `
        <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem; padding: 0.25rem 0;">
            <div style="width: 26px; height: 26px; border-radius: 50%; background: #4ade80; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">Correct query!</span>
          </div>
          <a href="${continueHref}" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 0.875rem; font-size: 1rem; border-radius: var(--radius-full);">Continue &rarr;</a>
        </div>
      `;
    } else if (validation.verdict === 'partial') {
      failedAttempts++;
      if (editorCard) editorCard.style.borderColor = '';
      const monoStyle = `font-family:var(--font-mono);background:rgba(234,179,8,0.15);padding:0.1rem 0.3rem;border-radius:4px;`;
      const partialMessages = {
        wrong_columns: `Right table, but check your <code style="${monoStyle}">SELECT</code> clause — you're selecting the wrong columns.`,
        wrong_row_count: `Your columns look right, but your query returned <strong>${validation.got}</strong> row${validation.got !== 1 ? 's' : ''} — expected <strong>${validation.expected}</strong>. Check your <code style="${monoStyle}">WHERE</code> or <code style="${monoStyle}">HAVING</code> clause.`,
        wrong_order: `All the right rows, but in the wrong order. Add or fix your <code style="${monoStyle}">ORDER BY</code> clause.`,
        wrong_values: `Your query has the right shape but the values don't match. Review your conditions and column references.`,
      };
      feedbackEl.innerHTML = `<div style="margin-top:0.75rem;background:rgba(234,179,8,0.08);border:1px solid rgba(234,179,8,0.25);border-radius:var(--radius-md);padding:0.75rem 1rem;color:#ca8a04;font-size:0.85rem;">${partialMessages[validation.reason] || 'Almost there — double-check your query.'}</div>`;
      renderHintPanel('hint-container', problem, failedAttempts, (ans) => setEditorValue(ans));
      maybeShowAICoach(sql, 'wrong_result', result);
    } else {
      failedAttempts++;
      if (editorCard) editorCard.style.borderColor = '';
      feedbackEl.innerHTML = `<div style="margin-top: 0.75rem; background: var(--error-dim); border: 1px solid rgba(239,68,68,0.25); border-radius: var(--radius-md); padding: 0.75rem 1rem; color: var(--error); font-size: 0.85rem;">Results don't match the expected output. Try again!</div>`;
      renderHintPanel('hint-container', problem, failedAttempts, (ans) => setEditorValue(ans));
      maybeShowAICoach(sql, 'wrong_result', result);
    }
  }

  async function maybeShowAICoach(sql, errorType, result) {
    if (!isAIEnabled()) return;
    const coachContainer = document.getElementById('ai-coach-container');
    if (!coachContainer) return;

    coachContainer.innerHTML = `
      <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); font-size: 0.875rem; color: var(--text-secondary);">
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; color: var(--accent); font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">
          <span class="coach-spinner"></span>
          AI Coach
        </div>
        <span style="color: var(--text-muted); font-style: italic;">Coach is thinking…</span>
      </div>
    `;

    try {
      const resultSummary = result.error
        ? `Error: ${result.error}`
        : `${(result.rows || []).length} rows returned`;

      const response = await getCoachResponse(errorType, sql, problem, resultSummary);
      if (response) {
        coachContainer.innerHTML = `
          <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-elevated); border: 1px solid var(--border-accent); border-radius: var(--radius-md); font-size: 0.875rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.6rem; color: var(--accent); font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              AI Coach
            </div>
            <p style="color: var(--text-primary); line-height: 1.6; margin: 0;">${response}</p>
          </div>
        `;
      } else {
        coachContainer.innerHTML = '';
      }
    } catch (e) {
      coachContainer.innerHTML = `
        <div style="margin-top: 1rem; padding: 0.75rem 1rem; background: var(--error-dim); border: 1px solid rgba(239,68,68,0.2); border-radius: var(--radius-md); font-size: 0.85rem; color: var(--text-secondary);">
          Coach is unavailable right now. Try a hint instead.
        </div>
      `;
    }
  }

  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
  const shortcut = isMac ? '⌘+Enter' : 'Ctrl+Enter';
  const problemNumber = currentIndex + 1;
  const totalInLevel = levelProblems.length;

  const stepDots = levelProblems.map((p, i) => `
    <div style="
      height: 3px; flex: 1; border-radius: 2px;
      background: ${i < currentIndex ? 'var(--accent)' : i === currentIndex ? 'var(--accent)' : 'var(--bg-elevated)'};
      opacity: ${i === currentIndex ? '1' : i < currentIndex ? '0.5' : '1'};
    "></div>
  `).join('');

  return `
    <div class="lesson-layout">
      <!-- Left Panel: Context -->
      <div class="card lesson-panel-left" style="display: flex; flex-direction: column; gap: 1rem; position: sticky; top: 1.5rem;">
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <a href="#/level/${problem.level}" style="color: var(--text-secondary); text-decoration: none; font-size: 0.875rem;">&larr; Back to Level</a>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${problemNumber} / ${totalInLevel}</span>
          </div>

          <!-- Step progress bar -->
          <div style="display: flex; gap: 3px; margin-bottom: 1rem;">${stepDots}</div>

          <h3 style="font-size: 1.75rem; margin-bottom: 1rem; line-height: 1.25;">${problem.title}</h3>

          <div style="background: var(--bg-elevated); padding: 1rem; border-radius: var(--radius-md); font-size: 0.95rem; line-height: 1.7; color: var(--text-primary);">
            ${problem.story}
          </div>
        </div>

        <div id="hint-container" style="flex-shrink: 0;"></div>
        <div id="ai-coach-container"></div>
      </div>

      <!-- Middle Panel: Editor & Results -->
      <div class="lesson-panel-middle" style="display: flex; flex-direction: column; gap: 1rem;">
        <div id="editor-card" class="card-dark" style="display: flex; flex-direction: column;">
          <div class="flex justify-between items-center mb-4">
            <h4 style="color: var(--text-secondary); margin: 0; font-size: 0.9rem; font-weight: 500;">Query Editor</h4>
            <button id="run-btn" class="btn btn-primary">Run Query (${shortcut})</button>
          </div>
          <div id="editor-container" style="height: 320px; background: #1a1a1a; border-radius: var(--radius-md); overflow: hidden;">
            <!-- Monaco will go here -->
          </div>
          <div id="feedback-container"></div>
        </div>

        <div class="card" style="display: flex; flex-direction: column;">
          <h4 style="color: var(--text-secondary); margin-bottom: 0.75rem; margin-top: 0; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em;">Results</h4>
          <div id="results-container" style="min-width: 0;">
            <p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 2rem; text-align: center;">Run a query to see results</p>
          </div>
        </div>
      </div>

      <!-- Right Panel: Dataset Explorer -->
      <div class="card lesson-panel-right" style="position: sticky; top: 1.5rem;">
        <!-- Mobile-only toggle header (hidden on desktop via CSS) -->
        <button class="dataset-mobile-toggle" onclick="
          const body = document.getElementById('dataset-body');
          const chev = document.getElementById('dataset-toggle-chev');
          const open = !body.classList.contains('collapsed');
          body.classList.toggle('collapsed', open);
          chev.style.transform = open ? 'rotate(-90deg)' : 'rotate(0deg)';
        " style="width:100%;align-items:center;justify-content:space-between;background:none;border:none;cursor:pointer;padding:0;margin-bottom:0.75rem;color:var(--text-primary);">
          <span style="font-size:0.9rem;font-weight:600;display:flex;align-items:center;gap:0.4rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
            Schema
          </span>
          <svg id="dataset-toggle-chev" style="transition:transform 0.2s ease;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        <!-- On mobile: collapsed by default. On desktop: no CSS rule hides it. -->
        <div id="dataset-body" class="dataset-mobile-body collapsed">
          <div id="dataset-explorer-container"></div>
        </div>
      </div>
    </div>
  `;
}
