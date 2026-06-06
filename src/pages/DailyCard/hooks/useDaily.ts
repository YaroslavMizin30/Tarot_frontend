import { useEffect, useState } from 'react';

import { updateActivity, getActivity } from '@/entities/Spread';
import { useUser } from '@/entities/User';

import { isToday } from '@/shared/utils/isToday';

export const useDaily = () => {
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  const checkDaily = async () => {
    if (!user) {
      return;
    }

    try {
      setIsLoading(true);

      const activity = await getActivity(user.id);

      if (activity) {
        const { dailyCardLastDate } = activity;

        if (isToday(dailyCardLastDate)) {
          setIsAvailable(false);
        }
      }
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
    id: user?.id,
  };
};
