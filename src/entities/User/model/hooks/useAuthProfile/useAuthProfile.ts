import { useQuery } from '@tanstack/react-query';

import { getCanonicalProfile } from '@/shared/api/platformBackend';
import { queryKeys } from '@/shared/api/queryKeys';

interface UseAuthProfileOptions {
  enabled: boolean;
}

export const useAuthProfile = ({
  enabled,
}: UseAuthProfileOptions) => {
  const query = useQuery({
    enabled,
    queryFn: getCanonicalProfile,
    queryKey: queryKeys.platformProfile.current,
    retry: false,
  });

  const response = query.data;

  return {
    error: query.error instanceof Error ? query.error.message : null,
    isLoading: enabled && query.isLoading,
    onboardingRequired: response?.onboardingRequired ?? null,
    profile: response?.profile,
    refetchProfile: query.refetch,
  };
};
