import problems from '../data/problems.json';
import { getAllLevelsProgress } from '../store/progress.js';

export default function LevelCompletePage() {
  const hash = window.location.hash;
  const levelId = parseInt(hash.split('/').pop(), 10) || 1;
  const levelsData = getAllLevelsProgress(problems);
  const data = levelsData[levelId];
  
  if (!data || data.total === 0) {
    return `<div class="container mt-8"><h3>No data for this level.</h3></div>`;
  }
  
  const isFullyComplete = data.completed === data.total;
  
  return `
    <div class="container mt-8" style="max-width: 600px; margin-top: 4rem;">
      <div class="card-dark" style="text-align: center; padding: 3rem 2rem;">
        <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 32px; background: rgba(34,197,94,0.1); color: var(--success); margin-bottom: 1.5rem;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        
        <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">Level ${levelId} ${isFullyComplete ? 'Mastered!' : 'In Progress'}</h2>
        <p style="color: var(--text-inverse-secondary); font-size: 1.1rem; margin-bottom: 2rem;">
          You've completed ${data.completed} out of ${data.total} missions in this level.
        </p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
          <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: var(--radius-lg);">
            <div style="font-size: 2rem; font-weight: 700; color: var(--success);">${data.completed - data.withAssist}</div>
            <div style="font-size: 0.85rem; color: var(--text-inverse-secondary); text-transform: uppercase;">Clean Solves</div>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: var(--radius-lg);">
            <div style="font-size: 2rem; font-weight: 700; color: var(--accent-yellow);">${data.withAssist}</div>
            <div style="font-size: 0.85rem; color: var(--text-inverse-secondary); text-transform: uppercase;">Assisted</div>
          </div>
        </div>
        
        <a href="#/dashboard" class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1.1rem; width: 100%;">Return to Dashboard</a>
      </div>
    </div>
  `;
}
