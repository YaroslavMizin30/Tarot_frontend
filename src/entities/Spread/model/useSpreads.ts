import { useEffect, useState } from 'react';
import { getSpreads } from '../api/getSpreads';
import type { Spread } from '../types';
import { useUserData } from '@/entities/User';

export const useSpreads = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [spreads, setSpreads] = useState<Spread[] | null>(null);
  const [lastDaily, setLastDaily] = useState<string | null>(null);

  const { userData } = useUserData();

  const fetchSpreads = async () => {
    setIsLoading(true);

    try {
      if (!userData) {
        return;
      }

      const response = await getSpreads(String(userData?.id));

      if (response) {
        setSpreads(response);

        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpreads();
  }, []);

  return {
    isLoading,
    spreads,
    lastDaily,
  };
};
