import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 } from 'uuid';

import { getHoroscopes } from '../api/getHoroscopes';
import { addHoroscope as addHoroscopeApi } from '../api/addHoroscope';
import { useUser } from '@/entities/User';
import { queryKeys } from '@/shared/api/queryKeys';
import useLocales from '@/shared/hooks/useLocales';
import requestAi, { type Prompt } from '@/shared/api/AI';

import type { Horoscope } from '../types';

export const useHoroscopes = () => {
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

  const { mutate: addHoroscope, isPending: isAdding } = useMutation({
    mutationFn: async (type: 'daily' | 'weekly' | 'monthly') => {
      const prompt = MESSAGES[type];
      const lastHoroscope = horoscopes?.[horoscopes?.length - 1];

      if (lastHoroscope) {
        prompt.unshift({ role: 'assistant', content: lastHoroscope.content });
      }

      const content = await requestAi(MESSAGES[type]);

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
  };
};
