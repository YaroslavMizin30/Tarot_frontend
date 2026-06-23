import { updateRaw } from '@/shared/api/supabase';

import { type User } from '../../types/user';

export const updateUser = async (userId: string, userData: Partial<User>) => {
  const updated = await updateRaw<User>(
    'users',
    userData,
    {
      key: 'id',
      value: userId,
    },
  );

  if (!updated) {
    return false;
  }

  return updated[0];
};
