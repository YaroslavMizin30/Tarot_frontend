import { useQuery } from '@tanstack/react-query';

import { getEphemeris } from '../api/getEphemeris';
import { useUser } from '@/entities/User';
import { queryKeys } from '@/shared/api/queryKeys';

export const useCalendar = () => {
  const { user } = useUser() ?? {};

  const {
    data: ephemeris,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: queryKeys.calendar.all,
    queryFn: getEphemeris,
    enabled: !!user,
  });

  return {
    isLoading,
    ephemeris,
    fetchCalendar: refetch,
    error,
  };
};
