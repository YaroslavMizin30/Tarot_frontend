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

  return {
    isLoading,
    calendar,
    fetchCalendar: refetch,
    error,
  };
};
