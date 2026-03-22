import { supabase, isAuthEnabled } from './supabase.js';
import { loadFromSupabase, migrateGuestProgress } from '../store/progress.js';

let sessionUser = null;

export function getSessionUser() {
  return sessionUser;
}

export function initAuthUI() {
  if (!isAuthEnabled()) {
    const btn = document.getElementById('auth-btn');
    if (btn) btn.style.display = 'none';
    return;
  }

  supabase.auth.onAuthStateChange(async (event, session) => {
    const prevUser = sessionUser;
    sessionUser = session?.user || null;

    if (event === 'SIGNED_IN' && sessionUser) {
      // If this is a fresh sign-in (not just a session restore), migrate guest data first
      if (!prevUser) {
        await migrateGuestProgress(sessionUser.id);
      }
      await loadFromSupabase(sessionUser.id);
    }

    updateAuthButton();
  });

  // Sync initial session state on first load
  supabase.auth.getSession().then(({ data: { session } }) => {
    sessionUser = session?.user || null;
    updateAuthButton();
  });
}

export function updateAuthButton() {
  const btn = document.getElementById('auth-btn');
  if (!btn) return;

  if (sessionUser) {
    const email = sessionUser.email || '';
    const label = email ? email.split('@')[0] : 'Account';
    btn.innerText = `${label} · Sign Out`;
    btn.onclick = async () => {
      await supabase.auth.signOut();
      window.location.reload();
    };
  } else {
    btn.innerText = 'Sign In';
    btn.onclick = showLoginModal;
  }
}

export function showLoginModal() {
  if (!isAuthEnabled()) {
    alert('Supabase keys not provided. Running locally as Guest.');
    return;
  }

  // Remove any existing modal
  const existing = document.getElementById('auth-modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'auth-modal-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.55);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999;
  `;

  overlay.innerHTML = `
    <div class="card" style="width: 100%; max-width: 420px; padding: 2rem;">
      <h3 style="margin-bottom: 0.25rem;" id="auth-modal-title">Sign In</h3>
      <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.5rem;" id="auth-modal-subtitle">
        Welcome back — enter your credentials
      </p>

      <input type="email" id="auth-email" placeholder="Email"
        style="width:100%; padding:0.75rem; margin-bottom:0.75rem;
               border:1px solid var(--border-color); border-radius:var(--radius-md);
               background:var(--bg-secondary); color:var(--text-primary); box-sizing:border-box;" />

      <input type="password" id="auth-password" placeholder="Password"
        style="width:100%; padding:0.75rem; margin-bottom:1.25rem;
               border:1px solid var(--border-color); border-radius:var(--radius-md);
               background:var(--bg-secondary); color:var(--text-primary); box-sizing:border-box;" />

      <button id="auth-submit-btn" class="btn btn-primary" style="width:100%; margin-bottom:0.75rem;">
        Sign In
      </button>

      <div style="text-align:center; font-size:0.85rem; color:var(--text-muted);">
        <span id="auth-toggle-text">Don't have an account?</span>
        <button id="auth-toggle-btn"
          style="background:none; border:none; color:var(--accent); cursor:pointer;
                 font-size:0.85rem; padding:0 0.25rem; text-decoration:underline;">
          Sign Up
        </button>
      </div>

      <button id="auth-close-btn" class="btn"
        style="width:100%; margin-top:1rem; background:var(--bg-secondary);">
        Cancel
      </button>

      <div id="auth-msg" style="margin-top:1rem; font-size:0.85rem; min-height:1.2em;"></div>
    </div>
  `;

  document.body.appendChild(overlay);

  let mode = 'signin'; // 'signin' | 'signup'

  const title = overlay.querySelector('#auth-modal-title');
  const subtitle = overlay.querySelector('#auth-modal-subtitle');
  const submitBtn = overlay.querySelector('#auth-submit-btn');
  const toggleBtn = overlay.querySelector('#auth-toggle-btn');
  const toggleText = overlay.querySelector('#auth-toggle-text');
  const msgEl = overlay.querySelector('#auth-msg');

  function setMode(newMode) {
    mode = newMode;
    if (mode === 'signin') {
      title.textContent = 'Sign In';
      subtitle.textContent = 'Welcome back — enter your credentials';
      submitBtn.textContent = 'Sign In';
      toggleText.textContent = "Don't have an account?";
      toggleBtn.textContent = 'Sign Up';
    } else {
      title.textContent = 'Create Account';
      subtitle.textContent = 'Your progress will be saved across devices';
      submitBtn.textContent = 'Create Account';
      toggleText.textContent = 'Already have an account?';
      toggleBtn.textContent = 'Sign In';
    }
    msgEl.textContent = '';
  }

  toggleBtn.onclick = () => setMode(mode === 'signin' ? 'signup' : 'signin');

  overlay.querySelector('#auth-close-btn').onclick = () => overlay.remove();

  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  submitBtn.onclick = async () => {
    const email = overlay.querySelector('#auth-email').value.trim();
    const password = overlay.querySelector('#auth-password').value;
    msgEl.style.color = 'var(--error)';
    msgEl.textContent = '';

    if (!email || !password) {
      msgEl.textContent = 'Please enter your email and password.';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = mode === 'signin' ? 'Signing in…' : 'Creating account…';

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        msgEl.textContent = error.message;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
      } else {
        overlay.remove();
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        msgEl.textContent = error.message;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
      } else {
        msgEl.style.color = 'var(--success, green)';
        msgEl.textContent = 'Account created! Check your email to confirm, then sign in.';
        submitBtn.disabled = false;
        setMode('signin');
      }
    }
  };

  // Allow Enter key to submit
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitBtn.click();
  });

  overlay.querySelector('#auth-email').focus();
}
