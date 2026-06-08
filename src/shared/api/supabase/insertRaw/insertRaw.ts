import { PostgrestError } from '@supabase/supabase-js';

export const insertRaw = async <T>(
  table: string,
  columns: Record<string, string | number | [] | boolean | undefined>,
): Promise<{ data: T[] | null; error: PostgrestError | null }> => {
  const { data, error } = await window.supabase.from(table).insert(columns);

  return {
    data,
    error,
  };
};
