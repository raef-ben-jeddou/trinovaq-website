import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "[TrinovaQ] Missing Supabase environment variables — " +
    "lead capture forms will be disabled. " +
    "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in GitHub Actions secrets."
  );
}

// Guard: createClient throws at module-init time if URL is missing, which crashes
// the entire React app before render, producing a blank page. Fall back to a
// no-op placeholder so the rest of the site still loads.
export const supabase = createClient(
  supabaseUrl ?? "https://placeholder.supabase.co",
  supabaseAnonKey ?? "placeholder-key-not-real"
);