import { useState } from 'react';

import requestAi from '@/shared/api/AI';
import { insertRaw } from '@/shared/api/supabase/index.ts';
import useLocales from '@/shared/hooks/useLocales';
import { sendMessage } from '@/shared/api/telegram/index.ts';

import getTelegramUser from '@/entities/TelegramUser/index.ts';
import { useUser } from '@/entities/User/index.ts';

import { getZodiacSign } from '../../lib/getZodiacSign.ts';

import type { CreateUserOptions } from './useCreateUser.types.ts';

export const useCreateUser = () => {
  const tgUser = getTelegramUser();

  const { i18n } = useLocales();
  const [isLoading, setIsLoading] = useState(false);
  const { user, refetchUser, isLoading: isUserLoading } = useUser();

  const [error, setError] = useState<string | null | unknown>(null);

  const createUser = async (options: CreateUserOptions) => {
    const { day, year, month, name, country, city, time } = options;

    const date = `${day}.${month}.${year}`;
    const place = `${country}, ${city}`;

    const zodiac = getZodiacSign(Number(day), Number(month));

    try {
      if (!tgUser) {
        throw new Error('No telegram user');
      }

      setError(null);
      setIsLoading(true);

      const card = await requestAi([
        {
          role: 'developer',
          content: `${i18n('User name')}: ${name}. ${i18n('Place of birth')}: ${place}. ${i18n('Date of birth')}: ${date}. ${i18n('Zodiac sign')}: ${i18n(zodiac)}. ${i18n('Birth time')}: ${time ?? i18n("The user doesn't know")}. ${i18n('Address no comments to user, only chart description')}. ${i18n("Don't duplicate user info, don't write about methods of composing")}. ${i18n('Describe the meaning of the chart to user')}`,
        },
        { role: 'user', content: i18n('Create natal chart for me') },
      ]);

      await window.supabase.auth.signUp({
        email: `${tgUser.id}@telegram.com`,
        password: `${tgUser.id}@telegram.com`,
      });

      await insertRaw('users', {
        id: tgUser.id,
        user_name: name,
        birth_date: date,
        birth_place: place,
        birth_time: time,
        natal_chart: card,
        sign: i18n(zodiac),
      });

      insertRaw('activity', { user_id: tgUser.id });

      refetchUser();

      sendMessage({
        text: i18n(
          '✅ Your natal chart is ready!\n\n🔮 Continue using TAROTOPIA for:\n• Daily predictions\n• Tarot readings for your questions\n• Tracking favorable periods\n\nUse the buttons in the menu to get started! ✨',
        ),
        replyMarkup: {
          resizeKeyboard: true,
          keyboard: [
            [
              { text: i18n('Daily prediction') },
              { text: i18n('Tarot reading') },
            ],
            [
              { text: i18n('Month horoscope') },
              { text: i18n('Horoscopes summary') },
            ],
            [{ text: i18n('Weekly horoscope') }],
          ],
        },
      });
    } catch (e) {
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
