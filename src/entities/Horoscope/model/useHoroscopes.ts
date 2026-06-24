import { useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 } from 'uuid';

import { getHoroscopes } from '../api/getHoroscopes';
import { addHoroscope as addHoroscopeApi } from '../api/addHoroscope';
import { useUser } from '@/entities/User';
import { queryKeys } from '@/shared/api/queryKeys';
import useLocales from '@/shared/hooks/useLocales';
import requestAi, { type Prompt } from '@/shared/api/AI';

import type { Horoscope } from '../types';

/**
 * Check whether a horoscope's date falls within the current period of its type.
 * - daily: same calendar date as today
 * - weekly: falls within this Mon–Sun week
 * - monthly: same month and year as now
 */
export const isHoroscopeInCurrentPeriod = (horoscope: Horoscope): boolean => {
  const hDate = new Date(horoscope.date);
  const now = new Date();

  switch (horoscope.type) {
    case 'daily':
      return hDate.toDateString() === now.toDateString();

    case 'weekly': {
      const startOfWeek = (d: Date): Date => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        date.setDate(diff);
        date.setHours(0, 0, 0, 0);
        return date;
      };
      const weekStart = startOfWeek(now);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      return hDate >= weekStart && hDate < weekEnd;
    }

    case 'monthly':
      return (
        hDate.getMonth() === now.getMonth() &&
        hDate.getFullYear() === now.getFullYear()
      );

    default:
      return false;
  }
};

interface UseHoroscopesOptions {
  /** Called after a horoscope is successfully added (post-invalidation) */
  onSuccess?: () => void;
}

export const useHoroscopes = (options?: UseHoroscopesOptions) => {
  const { user } = useUser() ?? {};
  const queryClient = useQueryClient();

  const {
    data: horoscopes,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.horoscopes.byUserId(user?.id ?? 'no-user'),
    queryFn: () => getHoroscopes(String(user!.id)),
    enabled: !!user,
  });

  const hasDaily = horoscopes?.some((h) => h.type === 'daily') ?? false;
  const hasWeekly = horoscopes?.some((h) => h.type === 'weekly') ?? false;
  const hasMonthly = horoscopes?.some((h) => h.type === 'monthly') ?? false;

  const { i18n } = useLocales();

  const [message, setMessage] = useState('');

  const DEVELOPER_MESSAGE =
    i18n('Make horoscope as a professional astrologist.') +
    i18n('Call user by name.') +
    i18n('User zodiac sign:') +
    user?.sign +
    user?.natalChart
      ? i18n('User natal chart:') + user?.natalChart
      : '' +
        i18n('Answer confidently. Do not discuss accuracy of the answer') +
        i18n('Do not repeat information from previous horoscope');

  const MESSAGES: Record<'daily' | 'weekly' | 'monthly', Prompt[]> = {
    daily: [
      { role: 'user', content: message || i18n('I want my daily horoscope') },
      {
        role: 'developer',
        content:
          i18n('Make daily horoscope for user') +
          DEVELOPER_MESSAGE +
          i18n('Make it brief'),
      },
    ],
    weekly: [
      {
        role: 'user',
        content: message || i18n('I want horoscope for this week'),
      },
      {
        role: 'developer',
        content:
          i18n(
            'Make weekly horoscope for user. Start from today to the end of the week',
          ) + DEVELOPER_MESSAGE,
      },
    ],
    monthly: [
      {
        role: 'user',
        content: message || i18n('I want my monthly horoscope'),
      },
    ],
  };

  const setUserMessage = (value: string) => {
    setMessage(value);
  };

  const findExistingHoroscopeInPeriod = useCallback(
    (type: 'daily' | 'weekly' | 'monthly'): Horoscope | null => {
      if (!horoscopes) return null;
      return (
        horoscopes
          .filter((h) => h.type === type)
          .find(isHoroscopeInCurrentPeriod) ?? null
      );
    },
    [horoscopes],
  );

  const { mutate: addHoroscope, isPending: isAdding } = useMutation({
    mutationFn: async (type: 'daily' | 'weekly' | 'monthly') => {
      const prompt = MESSAGES[type];

      if (message) {
        await addHoroscopeApi({
          id: v4(),
          content: message,
          type,
          sender: user!.userName,
          userId: user!.id,
          date: new Date().toISOString(),
          isUserMessage: true,
        });
      }

      const content = await requestAi(prompt);

      return addHoroscopeApi({
        id: v4(),
        content,
        type,
        sender: 'Tarotopia',
        userId: user!.id,
        date: new Date().toISOString(),
      } as Horoscope);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.horoscopes.byUserId(String(user?.id)),
      });

      setUserMessage('');
      options?.onSuccess?.();
    },
  });

  return {
    isLoading,
    horoscopes,
    fetchHoroscopes: refetch,
    addHoroscope,
    setUserMessage,
    message,
    isAdding,
    hasDaily,
    hasWeekly,
    hasMonthly,
    findExistingHoroscopeInPeriod,
  };
};
