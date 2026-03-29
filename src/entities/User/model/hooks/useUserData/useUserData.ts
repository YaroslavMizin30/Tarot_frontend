import { useEffect, useState } from 'react';

import {
  useAppSelector,
  useAppDispatch,
  setUser,
  type RootState,
} from '@/app/store';

import getTelegramUser from '@/entities/TelegramUser';
import { getUser } from '../../../api/getUser/getUser';

export const useUserData = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = useAppSelector((state: RootState) => state.user.value);

  const dispatch = useAppDispatch();

  const getUserData = async () => {
    setIsLoading(true);
    try {
      const user = getTelegramUser();

      if (user) {
        const { id } = user;

        const data = await getUser(String(id));
        dispatch(setUser(data));
      }
    } catch (error) {
      console.log(error);
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
  };
};
