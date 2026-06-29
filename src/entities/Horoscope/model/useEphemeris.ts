import { useQuery } from '@tanstack/react-query';

import { getEphemeris } from '../api/getEphemeris';
import { useUser } from '@/entities/User';
import { queryKeys } from '@/shared/api/queryKeys';

export const useEphemeris = () => {
  const { user } = useUser() ?? {};

  const {
    data: ephemeris,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: queryKeys.ephemeris.all,
    queryFn: getEphemeris,
    enabled: !!user,
  });

  return {
    isLoading,
    bodies: ephemeris?.bodies ?? {},
    astrology: ephemeris?.astrology,
    fetchCalendar: refetch,
    error,
  };
};
