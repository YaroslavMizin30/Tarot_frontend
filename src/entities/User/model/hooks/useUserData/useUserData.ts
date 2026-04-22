import { useEffect, useState } from 'react';

import {
  useAppSelector,
  useAppDispatch,
  setUser,
  type RootState,
} from '@/app/store';

import getTelegramUser from '@/entities/TelegramUser';
import { updateUser } from '@/entities/User/api/updateUser/updateUser';
import type { GetUserResponse } from '../../../types/user';

export const useUserData = () => {
  const [error, setError] = useState<string | null>(null);
  const { value: user, loading } = useAppSelector(
    (state: RootState) => state.user,
  );

  const dispatch = useAppDispatch();

  const getUserData = () => {
    try {
      const telegramUser = getTelegramUser() ?? { id: '681641883' };

      if (telegramUser && loading !== 'loading') {
        const { id } = telegramUser;

        if (!user) {
          dispatch(setUser(id));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserData = async (id: string, data: GetUserResponse) => {
    try {
      await updateUser(id, data);

      dispatch(setUser(String(user?.id)));
    } catch {
      setError('Error updating user data');
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return {
    isLoading: loading === 'loading',
    userData: user,
    updateUserData,
    error,
  };
};
