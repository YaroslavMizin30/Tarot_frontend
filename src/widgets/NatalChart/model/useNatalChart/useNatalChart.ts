import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { useUser } from '@/entities/User';

import { getZodiacSign } from '../../../../pages/Registry/lib/getZodiacSign';
import { createChart, type CreateChartParams } from '../../api/createChart';

export const useUpdateNatalChart = () => {
  const [error, setError] = useState<string | null | unknown>(null);

  const { updateUser, refetchUser, user } = useUser();

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
        userId,
        timeKnown,
        country,
        lang,
      } = options;

      const zodiac = getZodiacSign(Number(day), Number(month));

      await createChart({
        day,
        year,
        month,
        name,
        city,
        minute,
        hour,
        userId,
        timeKnown,
        lang,
      });

      setError(null);

      await updateUser(String(user!.id), {
        sign: zodiac !== 'Unknown' ? zodiac : undefined,
        birthDate: `${day}.${month}.${year}`,
        birthTime: `${hour}:${minute}`,
        birthPlace: `${country}, ${city}`,
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
