import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getGeneralHoroscopes } from '../api/getGeneralHoroscopes';
import type {
  GeneralHoroscope,
  GeneralHoroscopeLocale,
  GeneralHoroscopePeriod,
} from '../types';
import { queryKeys } from '@/shared/api/queryKeys';

const SIGN_IDS: Record<string, string> = {
  Aries: 'aries', Овен: 'aries',
  Taurus: 'taurus', Телец: 'taurus',
  Gemini: 'gemini', Близнецы: 'gemini',
  Cancer: 'cancer', Рак: 'cancer',
  Leo: 'leo', Лев: 'leo',
  Virgo: 'virgo', Дева: 'virgo',
  Libra: 'libra', Весы: 'libra',
  Scorpio: 'scorpio', Скорпион: 'scorpio',
  Sagittarius: 'sagittarius', Стрелец: 'sagittarius',
  Capricorn: 'capricorn', Козерог: 'capricorn',
  Aquarius: 'aquarius', Водолей: 'aquarius',
  Pisces: 'pisces', Рыбы: 'pisces',
};

const periodStart = (period: GeneralHoroscopePeriod) => {
  const now = new Date();
  const date = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  ));
  if (period === 'weekly') {
    const day = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() - day + 1);
  } else if (period === 'monthly') {
    date.setUTCDate(1);
  }
  return date.toISOString().slice(0, 10);
};

export const useGeneralHoroscopes = (
  userSign: string | undefined,
  locale: GeneralHoroscopeLocale,
) => {
  const sign = userSign ? SIGN_IDS[userSign] : undefined;
  const query = useQuery({
    queryKey: queryKeys.generalHoroscopes.bySign(sign ?? 'unknown', locale),
    queryFn: () => getGeneralHoroscopes(sign!, locale),
    enabled: Boolean(sign),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
  const data = query.data;

  const forecasts = useMemo(() => {
    const result = {} as Partial<Record<GeneralHoroscopePeriod, {
      forecast: GeneralHoroscope;
      isFallback: boolean;
    }>>;

    for (const period of ['daily', 'weekly', 'monthly'] as const) {
      const expectedStart = periodStart(period);
      const forecast = data?.find(
        (item) => item.period === period && item.period_start <= expectedStart,
      );
      if (forecast) {
        result[period] = {
          forecast,
          isFallback: forecast.period_start !== expectedStart,
        };
      }
    }
    return result;
  }, [data]);

  return { ...query, forecasts, sign };
};
