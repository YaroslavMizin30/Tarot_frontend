import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { useUser } from '@/entities/User';
import { useBalance } from '@/features/Billing';

import { getZodiacSign } from '../../../../pages/Registry/lib/getZodiacSign';
import { createChart, type CreateChartParams } from '../../api/createChart';

/** Стоимость создания/изменения натальной карты в пентаклях. */
const NATAL_CHART_COST = 10;

export const useUpdateNatalChart = () => {
  const [error, setError] = useState<string | null | unknown>(null);

  const { updateUser, refetchUser, user } = useUser();
  const { requireBalance } = useBalance();

  const updateMutation = useMutation({
    mutationFn: async (options: CreateChartParams): Promise<void> => {
      const {
        day,
        year,
        month,
        name,
        city,
        minute,
        hour,
        timeKnown,
        country,
        lang,
      } = options;

      // Проверяем баланс перед действием: если пентаклей не хватает,
      // useBalance сам редиректит пользователя на /billing.
      if (!requireBalance(NATAL_CHART_COST)) {
        throw new Error('INSUFFICIENT_BALANCE');
      }

      const zodiac = getZodiacSign(Number(day), Number(month));

      await createChart({
        day,
        year,
        month,
        name,
        city,
        minute,
        hour,
        timeKnown,
        lang,
      });

      setError(null);

      await updateUser(String(user!.id), {
        sign: zodiac !== 'Unknown' ? zodiac : undefined,
        birthDate: `${day}.${month}.${year}`,
        birthTime: timeKnown ? `${hour}:${minute}` : '',
        birthPlace: country ? `${country}, ${city}` : city,
      });

      await refetchUser();
    },
    onError: (e) => {
      setError(e);
    },
  });

  return {
    updateNatalChart: updateMutation.mutateAsync,
    isLoading: updateMutation.isPending,
    error,
  };
};
