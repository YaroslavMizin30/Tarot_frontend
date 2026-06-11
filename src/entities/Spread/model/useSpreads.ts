import { useEffect, useMemo, useState } from 'react';
import { getSpreads } from '../api/getSpreads';
import type { Spread } from '../types';
import { useUser } from '@/entities/User';
import { getTodayString } from '@/shared/utils/getTodayString';

export const useSpreads = () => {
  const [isLoading, setIsLoading] = useState(false);
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

  const todaysSpreadsCount = useMemo(() => {
    const today = getTodayString();

    return spreads?.filter((spread) => spread.date === today).length ?? 0;
  }, [spreads]);

  useEffect(() => {
    fetchSpreads();
  }, []);

  return {
    isLoading,
    spreads,
    unsummarizedSpreads,
    todaysSpreadsCount,
    fetchSpreads,
  };
};
