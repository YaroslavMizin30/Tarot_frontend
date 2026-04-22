import { useEffect, useState } from 'react';

import { updateActivity, getActivity } from '@/entities/Spread';
import { useUserData } from '@/entities/User';

import { isToday } from '@/shared/utils/isToday';

export const useDaily = () => {
  const { userData } = useUserData();

  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  const checkDaily = async () => {
    if (!userData) {
      return;
    }

    try {
      setIsLoading(true);

      const activity = await getActivity(userData.id);

      if (activity) {
        const { lastDaily } = activity;

        if (isToday(lastDaily)) {
          console.log(isToday(lastDaily));

          setIsAvailable(false);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserActivity = async () => {
    if (userData) {
      await updateActivity(userData.id, {
        lastDaily: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    checkDaily();
  }, []);

  return {
    isAvailable,
    sign: userData?.sign,
    isLoading,
    updateUserActivity,
    id: userData?.id,
  };
};
