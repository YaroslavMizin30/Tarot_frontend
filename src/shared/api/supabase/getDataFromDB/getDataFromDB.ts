import { initSupabase } from '../init/init';

import { PostgrestError } from '@supabase/supabase-js';

export const getDataFromDB = async <T>(
  table: string,
  columns: string[],
  equal: {
    key: string;
    value: string;
  },
): Promise<{data: T[] | null, error: PostgrestError | null}> => {
  const supabase = initSupabase();

  const { data, error } = await supabase.from(table).select(columns.join(', ')).eq(equal.key, equal.value);

  return {
    data,
    error,
  };
};
