import { getDataFromDB } from '@/shared/api/supabase';

export const getUser = async (id: string) => {
  const { data: user } = await getDataFromDB('users', ['*'], {
    key: 'id',
    value: id,
  });

  if (!user) {
    return {};
  }

  console.log(user[0]);

  return user[0];
};
