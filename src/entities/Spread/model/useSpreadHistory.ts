import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { useUser } from '@/entities/User';
import { queryKeys } from '@/shared/api/queryKeys';

import {
  getSpreadsPage,
  SPREAD_HISTORY_PAGE_SIZE,
} from '../api/getSpreads';

export const useSpreadHistory = () => {
  const { user } = useUser();

  const query = useInfiniteQuery({
    queryKey: queryKeys.spreads.history(user?.appUserId ?? 'no-user'),
    queryFn: ({ pageParam }) =>
      getSpreadsPage(
        user!.appUserId,
        pageParam,
        SPREAD_HISTORY_PAGE_SIZE,
      ),
    enabled: Boolean(user),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextOffset : undefined,
  });

  const spreads = useMemo(
    () => query.data?.pages.flatMap((page) => page.spreads) ?? [],
    [query.data],
  );

  return {
    ...query,
    spreads,
  };
};
