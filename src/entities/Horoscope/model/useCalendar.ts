import { useQuery } from '@tanstack/react-query';

import { getCalendar } from '../api/getCalendar';
import { useUser } from '@/entities/User';
import { queryKeys } from '@/shared/api/queryKeys';

export const useCalendar = () => {
  const { user } = useUser() ?? {};

  const {
    data: calendar,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: queryKeys.calendar.all,
    queryFn: getCalendar,
    enabled: !!user,
  });

  const moonPhases = Object.entries(calendar?.nextPhases ?? {})
    .sort((prev, next) => {
      const [, prevDate] = prev;
      const [, nextDate] = next;

      return new Date(prevDate) < new Date(nextDate) ? -1 : 1;
    })
    .map(([name, date]) => {
      return { name, date };
    });

  return {
    isLoading,
    calendar,
    moonPhases,
    fetchCalendar: refetch,
    error,
  };
};
