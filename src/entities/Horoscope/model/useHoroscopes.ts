import { useQuery } from '@tanstack/react-query';

import { getHoroscopes } from '../api/getHoroscopes';
import { useUser } from '@/entities/User';
import { queryKeys } from '@/shared/api/queryKeys';

export const useHoroscopes = () => {
  const { user } = useUser();

  const {
    data: horoscopes,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.horoscopes.byUserId(user?.id ?? 'no-user'),
    queryFn: () => getHoroscopes(String(user!.id)),
    enabled: !!user,
  });

  return {
    isLoading,
    horoscopes,
    fetchHoroscopes: refetch,
  };
};
