const PROGRESS_KEY = 'queryquest_progress';

// Local storage progress shape:
// {
//   "L1_P1": { completed: true, withAssist: false, attempts: 2 },
//   "L1_P2": { completed: true, withAssist: true, attempts: 4 }
// }

export function getLocalProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function saveLocalProgress(problemId, data) {
  const current = getLocalProgress();
  current[problemId] = {
    ...(current[problemId] || {}),
    ...data,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(current));
  
  // Try to sync if logged in (implemented later)
  // syncToSupabase();
}

export function getProblemStatus(problemId) {
  const progress = getLocalProgress();
  return progress[problemId] || { completed: false, withAssist: false, attempts: 0 };
}

export function getAllLevelsProgress(problems) {
  const progress = getLocalProgress();
  
  const levels = {
    1: { total: 0, completed: 0, withAssist: 0 },
    2: { total: 0, completed: 0, withAssist: 0 },
    3: { total: 0, completed: 0, withAssist: 0 },
    4: { total: 0, completed: 0, withAssist: 0 },
    5: { total: 0, completed: 0, withAssist: 0 }
  };

  problems.forEach(p => {
    if (levels[p.level]) {
      levels[p.level].total++;
      if (progress[p.id]?.completed) {
        levels[p.level].completed++;
        if (progress[p.id]?.withAssist) {
          levels[p.level].withAssist++;
        }
      }
    }
  });

  return levels;
}
