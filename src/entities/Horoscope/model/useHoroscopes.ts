import { useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 } from 'uuid';

import { useEphemerisByRange } from './useEphemerisByRange';
import { useDailyEphemeris } from './useDailyEphemeris';
import { getHoroscopes } from '../api/getHoroscopes';
import { addHoroscope as addHoroscopeApi } from '../api/addHoroscope';
import { useUser } from '@/entities/User';
import { queryKeys } from '@/shared/api/queryKeys';
import useLocales from '@/shared/hooks/useLocales';
import requestAi, { type Prompt } from '@/shared/api/AI';

import type { EphemerisByRangeResponse, Horoscope } from '../types';

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

  const { bodies } = useDailyEphemeris();
  const { ephemeris: monthlyEphemeris } = useEphemerisByRange('month');
  const { ephemeris: weeklyEphemeris } = useEphemerisByRange('week');

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

  const prepareEphemerisRange = (
    ephemeris?: EphemerisByRangeResponse | null,
  ) => {
    if (!ephemeris) {
      return '';
    }

    return ephemeris.reduce(
      (acc, current, index, array) => {
        const { bodies, timestamp } = current;

        if (new Date(timestamp) < new Date()) {
          //eslint-disable-next-line
          acc += '';
        } else {
          //eslint-disable-next-line
          acc +=
            `${new Date(timestamp).toLocaleDateString()}: ` +
            `${i18n(bodies.Moon?.name ?? '')}${bodies.Moon?.retrograde ? `(${i18n('retrograde (f)')})` : ''} - ${i18n(bodies.Moon?.sign ?? '')}, ` +
            `${i18n(bodies.Mercury?.name ?? '')}${bodies.Mercury?.retrograde ? `(${i18n('retrograde (m)')})` : ''} - ${i18n(bodies.Mercury?.sign ?? '')}, ` +
            `${i18n(bodies.Venus?.name ?? '')}${bodies.Venus?.retrograde ? `(${i18n('retrograde (f)')})` : ''} - ${i18n(bodies.Venus?.sign ?? '')}, ` +
            `${i18n(bodies.Mars?.name ?? '')}${bodies.Mars?.retrograde ? `(${i18n('retrograde (m)')})` : ''} - ${i18n(bodies.Mars?.sign ?? '')}, ` +
            `${i18n(bodies.Sun?.name ?? '')}${bodies.Sun?.retrograde ? `(${i18n('retrograde')})` : ''} - ${i18n(bodies.Sun?.sign ?? '')}` +
            `${index === array.length - 1 ? '. ' : '; '}`;
        }

        return acc;
      },
      `${i18n('Bodies positions for the period')}: `,
    );
  };

  const [message, setMessage] = useState('');

  const DEVELOPER_MESSAGE =
    `${i18n('Make horoscope as a professional astrologist.')} ` +
    `${i18n('Call user by name.')}. ` +
    `${i18n('User zodiac sign:')} ` +
    `${user?.sign}. ` +
    `${i18n('User name')}: ` +
    `${user?.userName}. ` +
    i18n('Answer confidently. Do not discuss accuracy of the answer');

  const MESSAGES: Record<'daily' | 'weekly' | 'monthly', Prompt[]> = {
    daily: [
      { role: 'user', content: message || i18n('I want my daily horoscope') },
      {
        role: 'developer',
        content:
          `${i18n('Make daily horoscope for user')}. ` +
          `${i18n('Bodies positions for today')}: ` +
          `${i18n(String(bodies.Moon?.name))}${bodies.Moon?.retrograde ? `(${i18n('retrograde (f)')})` : ''} - ${i18n(String(bodies?.Moon?.sign))}, ` +
          `${i18n(String(bodies.Mercury?.name))}${bodies.Mercury?.retrograde ? `(${i18n('retrograde (m)')})` : ''} - ${i18n(String(bodies?.Mercury?.sign))}, ` +
          `${i18n(String(bodies.Venus?.name))}${bodies.Venus?.retrograde ? `(${i18n('retrograde (f)')})` : ''} - ${i18n(String(bodies?.Venus?.sign))}, ` +
          `${i18n(String(bodies.Mars?.name))}${bodies.Mars?.retrograde ? `(${i18n('retrograde (m)')})` : ''} - ${i18n(String(bodies?.Mars?.sign))}, ` +
          `${i18n(String(bodies.Sun?.name))}${bodies.Sun?.retrograde ? `(${i18n('retrograde')})` : ''} - ${i18n(String(bodies?.Sun?.sign))}. ` +
          DEVELOPER_MESSAGE,
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
          `${i18n(
            'Make weekly horoscope for user. Start from today to the end of the week',
          )}. ` +
          prepareEphemerisRange(weeklyEphemeris) +
          `${i18n(
            'Do not describe each day in too much detail. Give the overall picture.',
          )} ` +
          DEVELOPER_MESSAGE,
      },
    ],
    monthly: [
      {
        role: 'user',
        content: message || i18n('I want my monthly horoscope'),
      },
      {
        role: 'developer',
        content:
          `${i18n('Make monthly horoscope for user.')} ` +
          prepareEphemerisRange(monthlyEphemeris) +
          `${i18n(
            'Do not describe each day in too much detail. Give the overall picture.',
          )} ` +
          DEVELOPER_MESSAGE,
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
