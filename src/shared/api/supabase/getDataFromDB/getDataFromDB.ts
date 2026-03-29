import { initSupabase } from '../init/init';

export const getDataFromDB = async (
  table: string,
  columns: string[],
  equal: {
    key: string;
    value: string;
  },
) => {
  const supabase = initSupabase();

  const { data, error } = await supabase.from(table).select(columns.join(', ')).eq(equal.key, equal.value);

  return {
    data,
    error,
  };
};
