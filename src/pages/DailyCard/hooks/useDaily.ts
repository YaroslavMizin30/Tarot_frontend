import { useEffect, useState } from 'react';

import { updateActivity, getActivity } from '@/entities/Spread';
import { useUser } from '@/entities/User';

import { isToday } from '@/shared/utils/isToday';

export const useDaily = () => {
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);

  const checkDaily = async () => {
    if (!user) {
      return;
    }

    try {
      const activity = await getActivity(user.id);

      if (activity) {
        const { dailyCardLastDate } = activity;

        if (isToday(dailyCardLastDate)) {
          setIsAvailable(false);
        }
      }
    } catch {
      setError('Error loading data. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserActivity = async () => {
    if (user) {
      await updateActivity(user.id, {
        dailyCardLastDate: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    checkDaily();
  }, []);

  return {
    isAvailable,
    sign: user?.sign,
    isLoading,
    updateUserActivity,
    checkDaily,
    id: user?.id,
    error,
  };
};
