import { backend } from '@/shared/api/backend';

import { type User, type UserProfileChanges } from '../../types/user';

interface UserResponse {
  user: User;
}

export const updateUser = async (changes: UserProfileChanges) => {
  const response = await backend.invoke<UserResponse>('user-profile', {
    action: 'update',
    changes,
  });

  return response.user;
};
