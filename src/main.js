import './styles/index.css';
import { initRouter } from './router.js';
import { supabase, isAuthEnabled } from './auth/supabase.js';

// Apply saved theme immediately to avoid flash
const savedTheme = localStorage.getItem('bdc-theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

document.addEventListener('DOMContentLoaded', async () => {
  // Restore existing session before rendering so auth state is ready
  if (isAuthEnabled()) {
    await supabase.auth.getSession();
  }
  initRouter();
});
