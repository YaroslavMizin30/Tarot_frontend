import { useEffect, useState } from 'react';

import {
  useAppSelector,
  useAppDispatch,
  setUser,
  type RootState,
} from '@/app/store';

import getTelegramUser from '@/entities/TelegramUser';
import { getUser } from '../../../api/getUser/getUser';
import { updateUser } from '@/entities/User/api/updateUser/updateUser';
import type { User } from '../../../types/user';

export const useUserData = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAppSelector((state: RootState) => state.user.value);

  const dispatch = useAppDispatch();

  const getUserData = async () => {
    setIsLoading(true);
    try {
      const telegramUser = getTelegramUser() ?? { id: '681641883' };

      if (telegramUser) {
        const { id } = telegramUser;

        if (!user) {
          const data = await getUser(String(id));
          dispatch(setUser(data));
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserData = async (id: string, data: User) => {
    try {
      setIsLoading(true);

      const updatedUser = await updateUser(id, data);

      if (updatedUser) {
        dispatch(setUser(updatedUser));
      }
    } catch {
      setError('Error updating user data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return {
    isLoading,
    userData: user,
    updateUserData,
    error,
  };
};
