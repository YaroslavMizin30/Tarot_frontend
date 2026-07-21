import { useQuery } from '@tanstack/react-query';

import { getSpreads } from '../api/getSpreads';
import { useUser } from '@/entities/User';
import { queryKeys } from '@/shared/api/queryKeys';

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
    queryFn: getSpreads,
    enabled: !!user,
  });

  return {
    isLoading,
    isFetching,
    error,
    spreads,
    fetchSpreads: refetch,
  };
};
