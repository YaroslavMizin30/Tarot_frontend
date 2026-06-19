import { useState } from 'react';

import {
  useAppSelector,
  useAppDispatch,
  setUser,
  type RootState,
} from '@/app/store';

import getTelegramUser from '@/entities/TelegramUser';
import { updateUser as updateUserApi } from '@/entities/User/api/updateUser/updateUser';
import type { GetUserResponse } from '../../../types/user';

export const useUser= () => {
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading } = useAppSelector((state: RootState) => state.user);

  const dispatch = useAppDispatch();

  const refetchUser = () => {
    try {
      const telegramUser = getTelegramUser();

      if (telegramUser && !isLoading) {
        const { id } = telegramUser;

        dispatch(setUser(id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = async (id: string, data: Partial<GetUserResponse>) => {
    try {
      await updateUserApi(id, data);

      dispatch(setUser(String(user?.id)));
    } catch {
      setError('Error updating user data');
    }
  };

  return {
    isLoading,
    user,
    updateUser,
    refetchUser,
    error,
  };
};
