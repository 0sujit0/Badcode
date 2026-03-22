import { supabase, isAuthEnabled } from '../auth/supabase.js';
import { getSessionUser } from '../auth/authUI.js';

const PROGRESS_KEY = 'queryquest_progress';

// ─── Local Storage ────────────────────────────────────────────────────────────

export function getLocalProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function writeLocalProgress(progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

// ─── Supabase Sync ────────────────────────────────────────────────────────────

/**
 * Upsert a single problem's progress row for the current user.
 */
async function syncToSupabase(problemId, data) {
  if (!isAuthEnabled()) return;
  const user = getSessionUser();
  if (!user) return;

  await supabase.from('user_progress').upsert({
    user_id: user.id,
    problem_id: problemId,
    completed: data.completed ?? false,
    with_assist: data.withAssist ?? false,
    attempts: data.attempts ?? 0,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,problem_id' });
}

/**
 * Load all progress rows for a user from Supabase and write to localStorage.
 * Called after sign-in.
 */
export async function loadFromSupabase(userId) {
  if (!isAuthEnabled()) return;

  const { data, error } = await supabase
    .from('user_progress')
    .select('problem_id, completed, with_assist, attempts, updated_at')
    .eq('user_id', userId);

  if (error || !data) return;

  const remoteProgress = {};
  data.forEach(row => {
    remoteProgress[row.problem_id] = {
      completed: row.completed,
      withAssist: row.with_assist,
      attempts: row.attempts,
      updatedAt: row.updated_at,
    };
  });

  // Merge: for each problem, keep whichever record is newer
  const local = getLocalProgress();
  const merged = { ...local };

  for (const [id, remote] of Object.entries(remoteProgress)) {
    const localRow = local[id];
    if (!localRow || new Date(remote.updatedAt) >= new Date(localRow.updatedAt || 0)) {
      merged[id] = remote;
    }
  }

  writeLocalProgress(merged);
}

/**
 * Bulk-upsert all existing localStorage progress into Supabase.
 * Called once when a guest user signs in for the first time.
 */
export async function migrateGuestProgress(userId) {
  if (!isAuthEnabled()) return;

  const local = getLocalProgress();
  const rows = Object.entries(local).map(([problemId, data]) => ({
    user_id: userId,
    problem_id: problemId,
    completed: data.completed ?? false,
    with_assist: data.withAssist ?? false,
    attempts: data.attempts ?? 0,
    updated_at: data.updatedAt || new Date().toISOString(),
  }));

  if (rows.length === 0) return;

  await supabase.from('user_progress').upsert(rows, {
    onConflict: 'user_id,problem_id',
    ignoreDuplicates: false,
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function saveLocalProgress(problemId, data) {
  const current = getLocalProgress();
  const updated = {
    ...(current[problemId] || {}),
    ...data,
    updatedAt: new Date().toISOString(),
  };
  current[problemId] = updated;
  writeLocalProgress(current);

  // Fire-and-forget sync to Supabase if logged in
  syncToSupabase(problemId, updated);
}

export function getProblemStatus(problemId) {
  const progress = getLocalProgress();
  return progress[problemId] || { completed: false, withAssist: false, attempts: 0 };
}

export function getMode() {
  return localStorage.getItem('queryquest_mode') || 'gated';
}

export function setMode(mode) {
  localStorage.setItem('queryquest_mode', mode);
}

export function isLevelUnlocked(levelId, allProblems) {
  if (getMode() === 'explore') return true;
  if (levelId <= 1) return true;
  const prevProblems = allProblems.filter(p => p.level === levelId - 1);
  const completed = prevProblems.filter(p => getProblemStatus(p.id).completed).length;
  return prevProblems.length === 0 || (completed / prevProblems.length) >= 0.8;
}

export function getAllLevelsProgress(problems) {
  const progress = getLocalProgress();

  const levels = {
    1: { total: 0, completed: 0, withAssist: 0 },
    2: { total: 0, completed: 0, withAssist: 0 },
    3: { total: 0, completed: 0, withAssist: 0 },
    4: { total: 0, completed: 0, withAssist: 0 },
    5: { total: 0, completed: 0, withAssist: 0 },
    6: { total: 0, completed: 0, withAssist: 0 },
    7: { total: 0, completed: 0, withAssist: 0 },
    8: { total: 0, completed: 0, withAssist: 0 },
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
