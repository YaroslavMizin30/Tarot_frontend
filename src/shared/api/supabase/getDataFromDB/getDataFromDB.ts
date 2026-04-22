import { PostgrestError } from '@supabase/supabase-js';

export const getDataFromDB = async <T>(
  table: string,
  columns: string[],
  equal: {
    key: string;
    value: string;
  },
): Promise<{ data: T[] | null; error: PostgrestError | null }> => {
  const { data, error } = await window.supabase
    .from(table)
    .select(columns.join(', '))
    .eq(equal.key, equal.value);

  return {
    //@ts-expect-error todo
    data,
    error,
  };
};
