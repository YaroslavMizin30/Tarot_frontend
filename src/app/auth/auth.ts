import { useEffect, useState } from 'react';

import getTelegramUser from '@/entities/TelegramUser';

import { auth } from '@/shared/api/supabase';

export const authenticate = async () => {
  const user = getTelegramUser();

  if (user?.id) {
    await auth({
      email: `${user.id}@telegram.com`,
      password: user.id.toString(),
    });
  }
};

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getAuth = async () => {
    try {
      setIsLoading(true);

      await authenticate();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAuth();
  }, []);

  return {
    isLoading,
  };
};
