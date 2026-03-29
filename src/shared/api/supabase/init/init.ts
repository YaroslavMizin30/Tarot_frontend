import { createClient } from '@supabase/supabase-js';

export const initSupabase = () => {
  const supabase = createClient(
    'https://hadjujaanfwgepckluqy.supabase.co',
    'sb_publishable_ZJjsUlkcKHaK6CBkgerHeA_IOG10Cwe',
  );

  return supabase;
};
