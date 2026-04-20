import { PostgrestError } from '@supabase/supabase-js';

export const updateRaw = async <T>(
  table: string,
  columns: Record<string, string | number | null>,
  equal: {
    key: string;
    value: string | number;
  },
): Promise<{ data: T[] | null; error: PostgrestError | null }> => {
  const { data, error } = await window.supabase
    .from(table)
    .update(columns)
    .eq(equal.key, equal.value);

  return {
    data,
    error,
  };
};
