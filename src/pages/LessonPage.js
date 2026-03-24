import { initEditor, getEditorValue, setEditorValue } from '../components/Editor.js';
import { renderResultsTable } from '../components/ResultsTable.js';
import { renderDatasetExplorer } from '../components/DatasetExplorer.js';
import { renderHintPanel } from '../components/HintPanel.js';
import { resetDatabase, executeQuery, validateResultDetailed, checkConcept } from '../engine/sqlEngine.js';
import { saveLocalProgress, getLocalProgress } from '../store/progress.js';
import { isAIEnabled } from '../ai/aiToggle.js';
import { getCoachResponse } from '../ai/aiCoach.js';
import problems from '../data/problems.json';
import { schema } from '../data/schema.js';
import PipelineSidebar from '../components/PipelineSidebar.js';
import PipelineProblem, { bindPipelineProblem } from '../components/PipelineProblem.js';

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

  const isPipelineProblem = problem.type === 'arrange_pipeline';

  requestAnimationFrame(() => requestAnimationFrame(async () => {
    if (!isPipelineProblem) {
      const editorContainer = document.getElementById('editor-container');
      if (editorContainer) {
        editorContainer.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;height:100%;gap:0.6rem;color:var(--text-muted);font-size:0.85rem;">
            <span class="coach-spinner"></span> Initializing SQL engine…
          </div>
        `;
      }
    }

    try {
      if (!isPipelineProblem) {
        await resetDatabase(problem.level);
        renderDatasetExplorer('dataset-explorer-container', problem);
        renderHintPanel('hint-container', problem, failedAttempts, (answer) => {
          setEditorValue(answer);
        });

        const starterQuery = problem.starterQuery || '';
        initEditor('editor-container', starterQuery, () => {
          document.getElementById('run-btn').click();
        });

        // Wire up editor placeholder
        setTimeout(() => {
          const editorEl = document.getElementById('editor-container');
          if (editorEl) {
            const placeholder = document.createElement('div');
            placeholder.className = 'editor-placeholder';
            placeholder.id = 'editor-placeholder';
            placeholder.textContent = 'Write your SQL query here...';
            editorEl.style.position = 'relative';
            editorEl.appendChild(placeholder);

            const checkPlaceholder = () => {
              const val = (getEditorValue() || '').trim();
              if (placeholder) {
                placeholder.style.display = val === '' ? 'block' : 'none';
              }
            };

            const attachListener = (attempts = 0) => {
              if (window._editorInstance) {
                window._editorInstance.onDidChangeModelContent(checkPlaceholder);
                checkPlaceholder();
              } else if (attempts < 20) {
                setTimeout(() => attachListener(attempts + 1), 150);
              }
            };
            attachListener();
          }
        }, 200);

        document.getElementById('run-btn').addEventListener('click', handleRun);
      } else {
        // Init Pipeline Problem
        renderDatasetExplorer('dataset-explorer-container', problem);
        bindPipelineProblem(problem, () => {
          saveLocalProgress(problem.id, {
            completed: true,
            withAssist: false,
            attempts: 1
          });
          const continueHref = isLastProblem
            ? `#/level-complete/${problem.level}`
            : `#/lesson/${nextProblemId}`;
          const ppContainer = document.getElementById('pp-container');
          if (ppContainer) {
            const btnArea = document.createElement('div');
            btnArea.innerHTML = `
              <a href="${continueHref}" class="btn btn-primary" style="margin-top:0.5rem;width:100%;justify-content:center;padding:0.875rem;font-size:1rem;border-radius:var(--radius-full);box-shadow:0 4px 14px rgba(200,245,66,0.2);">Continue &rarr;</a>
            `;
            ppContainer.appendChild(btnArea);
          }
        });
      }
    } catch (e) {
      console.error('Setup error', e);
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
    const feedbackEl = document.getElementById('feedback-container');
    const editorCard = document.getElementById('editor-card');

    // Reset previous feedback and borders
    feedbackEl.innerHTML = '';
    if (editorCard) editorCard.style.borderColor = 'var(--border)';

    if (result.error) {
      failedAttempts++;
      renderResultsTable('results-container', result);
      renderHintPanel('hint-container', problem, failedAttempts, (ans) => setEditorValue(ans));
      maybeShowAICoach(sql, 'syntax_error', result);
      return;
    }

    if (!checkConcept(sql, problem.requiredConcept)) {
      failedAttempts++;
      const syntheticResult = {
        error: `You must use the ${problem.requiredConcept} keyword in your query.`
      };
      renderResultsTable('results-container', syntheticResult);
      renderHintPanel('hint-container', problem, failedAttempts, (ans) => setEditorValue(ans));
      maybeShowAICoach(sql, 'missing_concept', result);
      return;
    }

    const validation = validateResultDetailed(result, problem.expectedOutput);

    // Send to ResultsTable which handles the unified banner logic
    renderResultsTable('results-container', result, validation, '0.8ms');

    if (validation.verdict === 'correct') {
      if (editorCard) editorCard.style.borderColor = 'var(--success)';

      saveLocalProgress(problem.id, {
        completed: true,
        withAssist: failedAttempts > 0,
        attempts: failedAttempts + 1
      });

      const continueHref = isLastProblem
        ? `#/level-complete/${problem.level}`
        : `#/lesson/${nextProblemId}`;

      feedbackEl.innerHTML = `
        <div style="margin-top: 1rem; animation: fadeUp 0.3s ease-out;">
          <a href="${continueHref}" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 0.875rem; font-size: 1rem; border-radius: var(--radius-full); box-shadow: 0 4px 14px rgba(200, 245, 66, 0.2);">Continue &rarr;</a>
        </div>
      `;
    } else {
      failedAttempts++;
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

  const progressData = getLocalProgress();

  // Build progress dot-track using CSS classes
  const stepDots = levelProblems.map((p, i) => {
    const isCompleted = progressData[p.id]?.completed;
    const isCurrent = p.id === problem.id;
    let dotClass = 'progress-dot';
    if (isCurrent) dotClass += ' active';
    else if (isCompleted) dotClass += ' done';
    return `<div class="${dotClass}"></div>`;
  }).join('');

  // Difficulty badge
  const difficulty = problemNumber <= 2 ? 'EASY' : problemNumber <= 4 ? 'MEDIUM' : 'HARD';
  const difficultyKey = difficulty.toLowerCase();
  const diffDot = difficulty === 'EASY'
    ? 'background:var(--success)'
    : difficulty === 'MEDIUM'
    ? 'background:var(--warning)'
    : 'background:var(--error)';

  // Wrap table names in problem.story with .table-ref spans — replace <code> tags
  let storyHtml = problem.story;
  storyHtml = storyHtml.replace(/<code>([^<]+)<\/code>/g, (match, name) => {
    return `<span class="table-ref">${name}</span>`;
  });

  return `
    <div class="lesson-layout" style="margin-top: 1rem;">

      <!-- Left Panel: Context -->
      <div class="lesson-panel-left" style="display: flex; flex-direction: column; gap: 18px; position: sticky; top: 1.5rem;">

        <!-- Problem Nav Group -->
        <div class="problem-nav-group">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <a href="#/level/${problem.level}" style="color: var(--text-secondary); text-decoration: none; font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; font-weight: 500; transition: color 0.15s;" onmouseenter="this.style.color='var(--text-primary)'" onmouseleave="this.style.color='var(--text-secondary)'">
              <span>←</span> Back to Level
            </a>
            <span style="font-size: 0.8rem; color: var(--text-secondary); font-family: var(--font-mono); font-weight: 600;">${problemNumber} / ${totalInLevel}</span>
          </div>
          <!-- Progress Dot-Track -->
          <div class="progress-track">${stepDots}</div>
        </div>

        <!-- Problem Title Group -->
        <div class="problem-title-group">
          <h3 style="font-size: 1.5rem; line-height: 1.25; font-weight: 600; letter-spacing: -0.02em; color: var(--text-primary);">${problem.title}</h3>
          <span class="difficulty-badge ${difficultyKey}">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; ${diffDot};"></span>
            ${difficulty}
          </span>
        </div>

        <!-- Problem Description Card -->
        <div class="problem-card">${storyHtml}</div>

        <!-- Hints Section -->
        <div id="hint-container"></div>

        <!-- AI Coach -->
        <div id="ai-coach-container"></div>
      </div>

      <!-- Middle Panel: Editor & Results -->
      <div class="lesson-panel-middle" style="display: flex; flex-direction: column; gap: 1rem;">
        ${isPipelineProblem ? PipelineProblem(problem) : `
        <!-- EDITOR SECTION -->
        <div id="editor-card" style="background: #111114; border: 1px solid var(--border); border-radius: var(--radius-md); display: flex; flex-direction: column; overflow: hidden; transition: border-color 0.3s;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); background: #0A0A0B;">
            <h4 style="color: var(--text-secondary); margin: 0; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.6rem;">
              QUERY EDITOR
              <span class="badge" style="background: rgba(200, 245, 66, 0.1); color: var(--accent); border: 1px solid rgba(200, 245, 66, 0.2);">SQL</span>
            </h4>
            <button id="run-btn" style="
              background: var(--accent); color: var(--text-inverse);
              border: none; border-radius: 4px; padding: 0.35rem 0.8rem;
              font-family: var(--font-sans); font-size: 0.8rem; font-weight: 700;
              display: flex; align-items: center; gap: 0.4rem; cursor: pointer;
              transition: transform 0.1s, opacity 0.15s;
            " onmouseenter="this.style.opacity='0.9'" onmouseleave="this.style.opacity='1'" onmousedown="this.style.transform='scale(0.97)'" onmouseup="this.style.transform='scale(1)'">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Run <span style="font-family: var(--font-mono); opacity: 0.7; font-weight: 600; font-size: 0.75rem;">${shortcut.replace('+', ' ')}</span>
            </button>
          </div>

          <div id="editor-container" style="height: 280px; width: 100%; position: relative;">
            <!-- Monaco + placeholder will go here -->
          </div>

          <div style="display: flex; justify-content: center; align-items: center; padding: 0; color: var(--text-muted); background: #111114; height: 16px; border-top: 1px solid rgba(255,255,255,0.03);">
          </div>
        </div>

        <!-- RESULTS SECTION -->
        <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; display: flex; flex-direction: column;">
          <div style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: var(--bg-results-toolbar);">
            <h4 style="color: var(--text-secondary); margin: 0; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Results</h4>
            <div style="display: flex; align-items: center; gap: 6px;">
              <div id="results-status-dot" class="status-dot"></div>
              <span id="results-status-text" style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">Waiting</span>
            </div>
          </div>

          <div id="results-container" style="min-width: 0;">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem 1rem; color: var(--text-muted); text-align: center;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 1rem; opacity: 0.3;"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>
              <p style="font-size: 0.9rem; margin-bottom: 0.5rem; color: var(--text-secondary);">Run a query to see results</p>
              <p style="font-size: 0.75rem; font-family: var(--font-mono); opacity: 0.5;">Press ${shortcut.replace('+', ' ')}</p>
            </div>
          </div>
          <div id="feedback-container" style="padding: 0 1rem 1rem;"></div>
        </div>
        `}
      </div>

      <!-- Right Panel: Dataset Explorer & Pipeline Sidebar -->
      <div class="lesson-panel-right" style="position: sticky; top: 1.5rem; max-height: calc(100vh - 3rem); overflow-y: auto;">
        <div id="pipeline-sidebar-container" style="margin-bottom: 1.5rem;">
          ${PipelineSidebar(problem.level, problem)}
        </div>
        <!-- Mobile-only toggle header -->
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
        <div id="dataset-body" class="dataset-mobile-body collapsed">
          <div id="dataset-explorer-container"></div>
        </div>
      </div>
    </div>
  `;
}
