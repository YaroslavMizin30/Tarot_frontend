export const initSupabase = async () => {
  const { createClient } = await import('@supabase/supabase-js');

  window.supabase = createClient(
    'https://hadjujaanfwgepckluqy.supabase.co',
    'sb_publishable_ZJjsUlkcKHaK6CBkgerHeA_IOG10Cwe',
  );
};
