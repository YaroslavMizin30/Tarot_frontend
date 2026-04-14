import { initSupabase } from '../init/init';

import { PostgrestError } from '@supabase/supabase-js';

const supabase = initSupabase();

export const insertRaw = async <T>(
  table: string,
  columns: Record<string, string | number | []>,
): Promise<{ data: T[] | null; error: PostgrestError | null }> => {
  const { data, error } = await supabase.from(table).insert(columns);

  return {
    data,
    error,
  };
};
