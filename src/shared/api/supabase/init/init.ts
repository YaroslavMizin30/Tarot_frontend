import { createClient } from '@supabase/supabase-js';

export const initSupabase = <T>() => {
  const supabase = createClient<T>(
    'https://hadjujaanfwgepckluqy.supabase.co',
    'sb_publishable_ZJjsUlkcKHaK6CBkgerHeA_IOG10Cwe',
  );

  return supabase;
};
