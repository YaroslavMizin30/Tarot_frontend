import { useEffect, useMemo, useState } from 'react';
import { getSpreads } from '../api/getSpreads';
import type { Spread } from '../types';
import { useUser } from '@/entities/User';

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

  useEffect(() => {
    fetchSpreads();
  }, []);

  return {
    isLoading,
    spreads,
    unsummarizedSpreads,
  };
};
