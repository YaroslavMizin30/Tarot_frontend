export const initSupabase = async () => {
  const { createClient } = await import('@supabase/supabase-js');

  window.supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY,
  );
};
