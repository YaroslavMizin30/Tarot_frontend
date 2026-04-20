import { createClient } from '@supabase/supabase-js';

export const initSupabase = () => {
  

  window.supabase = createClient(
    'https://hadjujaanfwgepckluqy.supabase.co',
    'sb_publishable_ZJjsUlkcKHaK6CBkgerHeA_IOG10Cwe',
  );
};
