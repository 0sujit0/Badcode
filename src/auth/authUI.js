import { supabase, isAuthEnabled } from './supabase.js';

let sessionUser = null;

export function initAuthUI() {
  // If Supabase is entirely missing, just disable auth UI
  if (!isAuthEnabled()) {
    console.log("Auth UI disabled due to missing credentials.");
    const btn = document.getElementById('auth-btn');
    if (btn) btn.style.display = 'none';
    return;
  }

  // Real implementation for authentication
  supabase.auth.onAuthStateChange((event, session) => {
    sessionUser = session?.user || null;
    updateAuthButton();
  });
  
  // Just trigger initial setup
  updateAuthButton();
}

export function showLoginModal() {
  if (!isAuthEnabled()) {
    alert("Supabase keys not provided. Running locally as Guest.");
    return;
  }
  
  // Create modal element
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '9999';
  
  modal.innerHTML = `
    <div class="card" style="width: 100%; max-width: 400px;">
      <h3 style="margin-bottom: 1.5rem;">Sign In / Sign Up</h3>
      <input type="email" id="auth-email" placeholder="Email" style="width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 1px solid var(--border-color); border-radius: var(--radius-md);" />
      <input type="password" id="auth-password" placeholder="Password" style="width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 1px solid var(--border-color); border-radius: var(--radius-md);" />
      
      <div style="display: flex; gap: 1rem; margin-top: 1rem;">
        <button id="btn-login" class="btn btn-primary" style="flex: 1;">Login</button>
        <button id="btn-signup" class="btn btn-dark" style="flex: 1;">Sign Up</button>
      </div>
      <button id="btn-close-modal" class="btn" style="width: 100%; margin-top: 1rem; background: var(--bg-secondary);">Cancel</button>
      <div id="auth-msg" style="margin-top: 1rem; color: var(--error); font-size: 0.85rem;"></div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  document.getElementById('btn-close-modal').onclick = () => {
    document.body.removeChild(modal);
  };
  
  document.getElementById('btn-login').onclick = async () => {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      document.getElementById('auth-msg').innerText = error.message;
    } else {
      document.body.removeChild(modal);
    }
  };

  document.getElementById('btn-signup').onclick = async () => {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      document.getElementById('auth-msg').innerText = error.message;
    } else {
      document.getElementById('auth-msg').innerText = "Check your email for confirmation.";
      document.getElementById('auth-msg').style.color = "var(--success)";
    }
  };
}

export function updateAuthButton() {
  const btn = document.getElementById('auth-btn');
  if (!btn) return;
  
  if (sessionUser) {
    btn.innerText = "Sign Out";
    btn.onclick = async () => {
      await supabase.auth.signOut();
      window.location.reload();
    };
  } else {
    btn.innerText = "Sign In";
    btn.onclick = showLoginModal;
  }
}
