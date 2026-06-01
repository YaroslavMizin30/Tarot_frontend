import { useEffect, useState } from 'react';

import getTelegramUser from '@/entities/TelegramUser';

import { auth } from '@/shared/api/supabase';

export const authenticate = () => {
  const user = getTelegramUser();

  if (user?.id) {
    return auth({
      email: `${user.id}@telegram.com`,
      password: user.id.toString(),
    });
  }
};

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] =
    useState<Awaited<ReturnType<typeof authenticate>>>(null);

  const getAuth = async () => {
    try {
      setIsLoading(true);

      const data = await authenticate();
      setUser(data);
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
    user,
  };
};
