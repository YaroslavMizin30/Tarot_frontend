import { useEffect, useState } from 'react';
import { v4 } from 'uuid';

import {
  useAppSelector,
  useAppDispatch,
  setUser,
  type RootState,
} from '@/app/store';

import getTelegramUser from '@/entities/TelegramUser';
import { updateUser } from '@/entities/User/api/updateUser/updateUser';
import type { GetUserResponse } from '../../../types/user';

import type { UseUserDataOptions } from './useUserData.types';

export const useUserData = (options: UseUserDataOptions = {}) => {
  const { retryCount = 2 } = options;

  const [error, setError] = useState<string | null>(null);
  const { value: user, loading } = useAppSelector(
    (state: RootState) => state.user,
  );

  const [refetch, setRefetch] = useState<string>('');

  const dispatch = useAppDispatch();

  const getUserData = () => {
    try {
      const telegramUser = getTelegramUser();

      if (telegramUser && loading !== 'loading' && retryCount > 0) {
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

  const refetchUserData = () => {
    setRefetch(v4());
  };

  useEffect(() => {
    getUserData();
  }, [refetch]);

  return {
    isLoading: loading === 'loading',
    userData: user,
    updateUserData,
    refetchUserData,
    error,
  };
};
