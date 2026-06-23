import { initSupabase } from './init/init';

let supabasePromise: Promise<void> | null = null;

/** Ensure supabase is initialized exactly once, returning a promise. */
export const ensureSupabase = (): Promise<void> => {
  if (!supabasePromise) {
    supabasePromise = initSupabase();
  }
  return supabasePromise;
};
