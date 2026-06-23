import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getSpreads } from '../api/getSpreads';
import { useUser } from '@/entities/User';
import { queryKeys } from '@/shared/api/queryKeys';
import { getTodayString } from '@/shared/utils/getTodayString';

export const useSpreads = () => {
  const { user } = useUser();

  const {
    data: spreads,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.spreads.byUserId(user?.id ?? 'no-user'),
    queryFn: () => getSpreads(String(user!.id)),
    enabled: !!user,
  });

  const unsummarizedSpreads = useMemo(() => {
    return spreads?.filter((spread) => !spread.isSummarized);
  }, [spreads]);

  const todaysSpreads = useMemo(() => {
    const today = getTodayString();

    return spreads?.filter((spread) => {
      return spread.date === today && spread.id !== 'single';
    });
  }, [spreads]);

  return {
    isLoading,
    spreads,
    unsummarizedSpreads,
    todaysSpreadsCount: todaysSpreads?.length ?? 0,
    fetchSpreads: refetch,
  };
};
