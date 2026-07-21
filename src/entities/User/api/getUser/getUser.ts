import { backend } from '@/shared/api/backend';

import type { User } from '../../types/user';

interface UserResponse {
  user: User | null;
}

export const getUser = async (): Promise<User | null> => {
  const response = await backend.invoke<UserResponse>('user-profile', {
    action: 'get',
  });
  return response.user;
};
