import { getDataFromDB } from '@/shared/api/supabase';

import type { User } from '../../types/user';

interface UserResponse extends Omit<User, 'natalChart'> {
  natalChart: string;
  bonus_balance?: number;
}

export const getUser = async (id: string | number): Promise<User | null> => {
  const data = await getDataFromDB<UserResponse>('users', {
    key: 'id',
    value: String(id),
  }, { throwOnError: true });

  if (!data || data.length === 0) {
    return null;
  }

  const user = data[0];

  return {
    ...user,
    natalChart: user.natalChart ? JSON.parse(user.natalChart) : null,
    bonusBalance: Number(user.bonus_balance ?? user.bonusBalance ?? 0),
  };
};
