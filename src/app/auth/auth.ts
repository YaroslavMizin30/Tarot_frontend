import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import {
  useAppSelector,
  useAppDispatch,
  setUser,
  type RootState,
} from '@/app/store';

import getTelegramUser from '@/entities/TelegramUser';

import { initSupabase } from '@/shared/api/supabase';

export const useAuth = () => {
  const { user, isLoading, error } = useAppSelector(
    (state: RootState) => state.user,
  );

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const getAuth = async () => {
    try {
      await initSupabase();

      const { id } = getTelegramUser() ?? {};

      if (id) {
        const { error } = await window.supabase.auth.signInWithPassword({
          email: `${id}@telegram.com`,
          password: `${id}`,
        });

        dispatch(setUser(id));

        if (error) {
          navigate('/reg');
        }
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
