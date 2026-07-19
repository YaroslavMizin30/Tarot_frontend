import { useState } from 'react';

import {
  authenticateWithTelegram,
  insertRaw,
} from '@/shared/api/supabase/index.ts';
import useLocales from '@/shared/hooks/useLocales';

import { useUser } from '@/entities/User/index.ts';
import { sendAnalytics } from '@/entities/Analytics';
import { createChart } from '@/widgets/NatalChart/api/createChart';

import { getZodiacSign } from '../../lib/getZodiacSign.ts';

import type { CreateUserOptions } from './useCreateUser.types.ts';

export const useCreateUser = () => {
  const { locale } = useLocales();
  const [isLoading, setIsLoading] = useState(false);
  const { user, refetchUser, isLoading: isUserLoading } = useUser();

  const [error, setError] = useState<string | null | unknown>(null);

  const createUser = async (options: CreateUserOptions) => {
    let profileCreated = false;
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

    const zodiac = getZodiacSign(Number(day), Number(month));

    try {
      setError(null);
      setIsLoading(true);

      const { telegramId: id } = await authenticateWithTelegram();

      const inserted = await insertRaw('users', {
        id,
        userName: name,
        birthDate: date,
        birthPlace: place,
        birthTime: time ?? '',
        sign: zodiac,
      });

      if (!inserted?.length) {
        throw new Error('USER_CREATION_FAILED');
      }
      profileCreated = true;

      insertRaw('activity', { userId: id });

      sendAnalytics(id, {
        registered: true,
        lastActionAt: new Date().toISOString(),
        tarotSpreadsCount: 0,
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

      await refetchUser();

    } catch (e) {
      if (profileCreated) {
        await refetchUser();
      }
      setError(e);
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
