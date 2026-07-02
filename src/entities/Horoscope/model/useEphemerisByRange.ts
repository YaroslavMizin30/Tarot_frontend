import { useQuery } from '@tanstack/react-query';

import { getEphemerisRange } from '../api/getEphemerisRange';
import { useUser } from '@/entities/User';
import { queryKeys } from '@/shared/api/queryKeys';

export const useEphemerisByRange = (type: 'week' | 'month') => {
  const { user } = useUser() ?? {};

  const queryFn = () => {
    return getEphemerisRange(type);
  };

  const {
    data: ephemeris,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: queryKeys.ephemeris[type],
    queryFn,
    enabled: !!user,
  });

  return {
    isLoading,
    fetchCalendar: refetch,
    error,
    ephemeris,
  };
};
