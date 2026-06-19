import { useEffect, useMemo, useState } from 'react';
import { getSpreads } from '../api/getSpreads';
import type { Spread } from '../types';
import { useUser } from '@/entities/User';
import { getTodayString } from '@/shared/utils/getTodayString';

export const useSpreads = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [spreads, setSpreads] = useState<Spread[] | null>(null);

  const { user } = useUser();

  const fetchSpreads = async () => {
    setIsLoading(true);

    try {
      if (!user) {
        return;
      }

      const response = await getSpreads(String(user?.id));

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

  const unsummarizedSpreads = useMemo(() => {
    return spreads?.filter((spread) => !spread.isSummarized);
  }, [spreads]);

  const todaysSpreads = useMemo(() => {
    const today = getTodayString();

    return spreads?.filter((spread) => {
      return spread.date === today && spread.id !== 'single';
    });
  }, [spreads]);

  useEffect(() => {
    fetchSpreads();
  }, []);

  return {
    isLoading,
    spreads,
    unsummarizedSpreads,
    todaysSpreadsCount: todaysSpreads?.length ?? 0,
    fetchSpreads,
  };
};
