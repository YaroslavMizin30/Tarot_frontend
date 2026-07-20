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
    error,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.spreads.byUserId(user?.appUserId ?? 'no-user'),
    queryFn: () => getSpreads(user!.appUserId),
    enabled: !!user,
  });

  const todaysSpreads = useMemo(() => {
    const today = getTodayString();

    return spreads?.filter((spread) => {
      return spread.date === today && spread.id !== 'single';
    });
  }, [spreads]);

  return {
    isLoading,
    isFetching,
    error,
    spreads,
    todaysSpreadsCount: todaysSpreads?.length ?? 0,
    fetchSpreads: refetch,
  };
};
