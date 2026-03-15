import { createClient } from '@supabase/supabase-js';

// Get env vars. Vite exposes them on import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.warn("Failed to initialize Supabase client. Running in guest mode.", error);
  }
} else {
  console.log("Supabase credentials missing. Running in guest mode only (local storage).");
}

export { supabase };

// Helper to check if auth is active
export function isAuthEnabled() {
  return supabase !== null;
}
