import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { useUser } from '@/entities/User';
import getTelegramUser from '@/entities/TelegramUser';
import { ensureSupabase } from '@/shared/api/supabase';

export const useAuth = () => {
  const { user, isLoading, error: userError } = useUser();
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const getAuth = async () => {
    try {
      await ensureSupabase();

      const { id } = getTelegramUser() ?? {};

      if (id) {
        const { error: signInError } =
          await window.supabase.auth.signInWithPassword({
            email: `${id}@telegram.com`,
            password: `${id}`,
          });

        if (signInError) {
          navigate('/reg');
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Authentication failed');
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    getAuth();
  }, []);

  return {
    isLoading: isInitializing || isLoading,
    user,
    error: error || userError,
  };
};
