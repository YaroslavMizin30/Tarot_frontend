import { useState } from 'react';

import requestAi from '@/shared/api/AI';
import { updateRaw } from '@/shared/api/supabase';
import useLocales from '@/shared/hooks/useLocales';

import { getZodiacSign } from '../../../../pages/Registry/lib/getZodiacSign';

import type { UpdateNatalChartOptions } from './useUpdateNatalChart.types';

export const useUpdateNatalChart = () => {
  const { i18n } = useLocales();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null | unknown>(null);

  const updateNatalChart = async (
    options: UpdateNatalChartOptions,
  ): Promise<boolean> => {
    const { day, year, month, name, country, city, time, userId } = options;

    const date = `${day}.${month}.${year}`;
    const place = `${country}, ${city}`;

    const zodiac = getZodiacSign(Number(day), Number(month));

    try {
      setError(null);
      setIsLoading(true);

      const card = await requestAi([
        {
          role: 'developer',
          content: `${i18n('User name')}: ${name}. ${i18n('Place of birth')}: ${place}. ${i18n('Date of birth')}: ${date}. ${i18n('Zodiac sign')}: ${i18n(zodiac)}. ${i18n('Birth time')}: ${time ?? i18n("The user doesn't know")}. ${i18n('Address no comments to user, only chart description')}. ${i18n("Don't duplicate user info, don't write about methods of composing")}. ${i18n('Describe the meaning of the chart to user')}`,
        },
        { role: 'user', content: i18n('Create natal chart for me') },
      ]);

      const { error: updateError } = await updateRaw(
        'users',
        {
          user_name: name,
          birth_date: date,
          birth_place: place,
          birth_time: time ?? null,
          natal_chart: card,
          sign: i18n(zodiac),
        },
        {
          key: 'id',
          value: userId,
        },
      );

      if (updateError) {
        throw updateError;
      }

      return true;
    } catch (e) {
      setError(e);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateNatalChart,
    isLoading,
    error,
  };
};
