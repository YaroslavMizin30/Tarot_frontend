import { useState } from 'react';

import {
  completeUserOnboarding,
} from '@/shared/api/supabase/index.ts';
import { authenticateCurrentPlatform } from '@/shared/api/auth';
import useLocales from '@/shared/hooks/useLocales';

import { useUser } from '@/entities/User/index.ts';
import { createChart } from '@/widgets/NatalChart/api/createChart';

import type { CreateUserOptions } from './useCreateUser.types.ts';

export const useCreateUser = () => {
  const { locale } = useLocales();
  const [isLoading, setIsLoading] = useState(false);
  const { user, refetchUser, isLoading: isUserLoading } = useUser();

  const [error, setError] = useState<string | null | unknown>(null);

  const createUser = async (options: CreateUserOptions) => {
    const {
      day,
      year,
      month,
      name,
      country,
      city,
      time,
      withNatalChart = false,
    } = options;

    const date = `${day}.${month}.${year}`;
    const place = country && city ? `${country}, ${city}` : '';

    try {
      setError(null);
      setIsLoading(true);

      await authenticateCurrentPlatform();
      await completeUserOnboarding({
        userName: name,
        birthDate: date,
        birthPlace: place,
        birthTime: time ?? '',
      });

      if (withNatalChart) {
        await createChart({
          name,
          year,
          month,
          day,
          timeKnown: Boolean(time),
          hour: time?.split(':')[0],
          minute: time?.split(':')[1],
          city: city ?? '',
          country,
          lang: locale === 'ru' ? 'ru-RU' : 'en-EN',
        });
      }

      const result = await refetchUser();
      if (!result.data) {
        throw new Error('USER_ONBOARDING_NOT_VISIBLE');
      }
    } catch (e) {
      // The transaction may have committed even if its HTTP response was
      // interrupted. Re-read the profile before presenting a retry error.
      const result = await refetchUser();
      if (!result.data) {
        setError(e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createUser,
    isLoading: isLoading || isUserLoading,
    error,
    user,
  };
};
