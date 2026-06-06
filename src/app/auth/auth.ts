import { useEffect } from 'react';

import {
  useAppSelector,
  useAppDispatch,
  setUser,
  type RootState,
} from '@/app/store';

import getTelegramUser from '@/entities/TelegramUser';

import { initSupabase } from '@/shared/api/supabase';
import { auth } from '@/shared/api/supabase';

export const authenticate = async () => {
  const user = getTelegramUser();

  if (user?.id) {
    const authData = await auth({
      email: `${user.id}@telegram.com`,
      password: user.id.toString(),
    });

    return { ...authData, telegramId: user.id };
  }
};

export const useAuth = () => {
  const {
    user,
    isLoading,
    error,
  } = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  const getAuth = async () => {
    try {
      await initSupabase();

      const authUser = await authenticate();

      if (authUser) {
        dispatch(setUser(authUser?.telegramId));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAuth();
  }, []);

  return {
    isLoading,
    user,
    error,
  };
};
