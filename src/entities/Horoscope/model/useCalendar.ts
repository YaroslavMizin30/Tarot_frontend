import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getCalendar } from '../api/getCalendar';
import { createMoonCalendarIndex } from '../lib/calendar';

import { useUser } from '@/entities/User';
import { queryKeys } from '@/shared/api/queryKeys';

export const useCalendar = () => {
  const { user } = useUser();

  const query = useQuery({
    queryKey: queryKeys.calendar.all,
    queryFn: getCalendar,
    // Calendar rows are protected by Supabase RLS and need the user session.
    enabled: Boolean(user),
  });

  const items = useMemo(() => {
    return [...(query.data ?? [])].sort((left, right) =>
      left.date.localeCompare(right.date),
    );
  }, [query.data]);

  const itemIndex = useMemo(
    () => createMoonCalendarIndex(items),
    [items],
  );

  return {
    items,
    itemIndex,
    isLoading: query.isPending,
    isFetching: query.isFetching,
    error: query.error,
    fetchCalendar: query.refetch,
  };
};
