import { useState } from 'react';

import requestAi from '@/shared/api/AI';
import { insertRaw } from '@/shared/api/supabase/index.ts';
import useLocales from '@/shared/hooks/useLocales';

import getTelegramUser from '@/entities/TelegramUser/index.ts';
import { useUser } from '@/entities/User/index.ts';
import { useBalance } from '@/features/Billing';
import { sendAnalytics } from '@/entities/Analytics';

import { getZodiacSign } from '../../lib/getZodiacSign.ts';

import type { CreateUserOptions } from './useCreateUser.types.ts';

/** Стоимость создания натальной карты при регистрации в пентаклях. */
const NATAL_CHART_COST = 10;

export const useCreateUser = () => {
  const tgUser = getTelegramUser();

  const { i18n } = useLocales();
  const [isLoading, setIsLoading] = useState(false);
  const { user, refetchUser, isLoading: isUserLoading } = useUser();
  const { requireBalance, charge } = useBalance();

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

    // Если регистрация идёт вместе с натальной картой — это платное действие.
    // Проверяем баланс до того, как начнём создавать пользователя/карту:
    // useBalance сам редиректит на /billing при нехватке пентаклей.
    if (withNatalChart && !requireBalance(NATAL_CHART_COST)) {
      setError(new Error('INSUFFICIENT_BALANCE'));
      return;
    }

    const date = `${day}.${month}.${year}`;
    const place = country && city ? `${country}, ${city}` : '';

    const zodiac = getZodiacSign(Number(day), Number(month));

    try {
      if (!tgUser) {
        throw new Error('No telegram user');
      }

      setError(null);
      setIsLoading(true);

      const { id } = tgUser ?? {};

      await window.supabase.auth.signUp({
        email: `${id}@telegram.com`,
        password: `${id}`,
      });

      let card: string = '';

      if (withNatalChart) {
        card = await requestAi([
          {
            role: 'developer',
            content: `${i18n('User name')}: ${name}. ${i18n('Place of birth')}: ${place}. ${i18n('Date of birth')}: ${date}. ${i18n('Zodiac sign')}: ${i18n(zodiac)}. ${i18n('Birth time')}: ${time ?? i18n("The user doesn't know")}. ${i18n('Address no comments to user, only chart description')}. ${i18n("Don't duplicate user info, don't write about methods of composing")}. ${i18n('Describe the meaning of the chart to user')}`,
          },
          { role: 'user', content: i18n('Create natal chart for me') },
        ]);
      }

      await insertRaw('users', {
        id,
        userName: name,
        birthDate: date,
        birthPlace: place,
        birthTime: time ?? '',
        natalChart: card,
        sign: i18n(zodiac),
      });

      refetchUser();

      insertRaw('activity', { userId: tgUser.id });

      sendAnalytics(id, {
        registered: true,
        lastActionAt: new Date().toISOString(),
        tarotSpreadsCount: 0,
      });

      // Списываем пентакли только после того, как все данные успешно сохранены.
      if (withNatalChart) {
        await charge(NATAL_CHART_COST);
      }
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
