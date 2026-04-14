import { getDataFromDB } from '@/shared/api/supabase';

export const getSpreads = async (id: string) => {
  const { data } = await getDataFromDB('spreads', ['*'], {
    key: 'user_id',
    value: id,
  });

  return data;
};
