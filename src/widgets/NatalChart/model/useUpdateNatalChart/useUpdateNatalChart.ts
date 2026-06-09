import { useState } from 'react';

import requestAi from '@/shared/api/AI';
import { updateRaw } from '@/shared/api/supabase';
import useLocales from '@/shared/hooks/useLocales';

import { getActivity } from '@/entities/Spread/api/getActivity';
import { updateActivity } from '@/entities/Spread/api/updateActivity';
import { getZodiacSign } from '../../../../pages/Registry/lib/getZodiacSign';

import type {
  UpdateNatalChartOptions,
  UpdateNatalChartResult,
} from './useUpdateNatalChart.types';

/**
 * Returns the ISO timestamp at which the user is next allowed to update
 * their natal chart.
 *
 * Logic: a user can update once per paid (subscription) period. The next
 * available moment is the later of:
 *   - the user's current subscription expiration date
 *   - one month after their last update
 */
export const getNextAvailableUpdate = (
  expirationDate?: string,
  lastUpdate?: string,
): string | undefined => {
  const now = new Date();

  const candidates: number[] = [];

  if (expirationDate) {
    const exp = new Date(expirationDate);

    if (!Number.isNaN(exp.getTime())) {
      // The next paid period starts right after the current one expires.
      candidates.push(exp.getTime());
    }
  }

  if (lastUpdate) {
    const last = new Date(lastUpdate);

    if (!Number.isNaN(last.getTime())) {
      // After an update, the user can edit again one month later.
      const next = new Date(last);

      next.setMonth(next.getMonth() + 1);

      candidates.push(next.getTime());
    }
  }

  if (candidates.length === 0) return undefined;

  const nextAt = new Date(Math.max(...candidates));

  // If both candidates are in the past, the user can update right now.
  if (nextAt.getTime() <= now.getTime()) return undefined;

  return nextAt.toISOString();
};

export const canUpdateNatalChart = (
  expirationDate?: string,
  lastUpdate?: string,
): boolean => {
  return getNextAvailableUpdate(expirationDate, lastUpdate) === undefined;
};

export const useUpdateNatalChart = () => {
  const { i18n } = useLocales();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null | unknown>(null);

  const updateNatalChart = async (
    options: UpdateNatalChartOptions,
  ): Promise<UpdateNatalChartResult> => {
    const { day, year, month, name, country, city, time, userId } = options;

    const date = `${day}.${month}.${year}`;
    const place = `${country}, ${city}`;

    const zodiac = getZodiacSign(Number(day), Number(month));

    try {
      setError(null);
      setIsLoading(true);

      // Enforce the once-per-paid-period restriction: if the user has
      // already updated in the current subscription period, bail out
      // before calling the AI.
      const activity = await getActivity(Number(userId));

      const { expirationDate } = options;

      if (!canUpdateNatalChart(expirationDate, activity?.natalChartLastUpdate)) {
        const nextAvailableAt = getNextAvailableUpdate(
          expirationDate,
          activity?.natalChartLastUpdate,
        );

        return { success: false, reason: 'rate-limited', nextAvailableAt };
      }

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

      // Persist the update timestamp so the restriction holds for the
      // remainder of the current paid period.
      await updateActivity(Number(userId), {
        natalChartLastUpdate: new Date().toISOString(),
      });

      return { success: true };
    } catch (e) {
      setError(e);

      return { success: false, reason: 'error' };
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
