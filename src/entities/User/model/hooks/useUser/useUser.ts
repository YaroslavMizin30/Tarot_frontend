import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getUser } from '@/entities/User/api/getUser/getUser';
import { compareProfileCanary } from '@/entities/User/api/compareProfileCanary/compareProfileCanary';
import { updateUser as updateUserApi } from '@/entities/User/api/updateUser/updateUser';
import { authenticateCurrentPlatform } from '@/shared/api/auth';
import { queryKeys } from '@/shared/api/queryKeys';
import type { User, UserProfileChanges } from '../../../types/user';

interface UseUserOptions {
  enabled?: boolean;
}

export const useUser = ({ enabled = true }: UseUserOptions = {}) => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    refetch,
    error: queryError,
  } = useQuery({
    enabled,
    queryKey: queryKeys.user.current,
    queryFn: async () => {
      await authenticateCurrentPlatform();
      const currentUser = await getUser();
      compareProfileCanary(currentUser).catch(() => undefined);
      return currentUser;
    },
    retry: false,
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUserApi,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<User | null>(
        queryKeys.user.current,
        updatedUser,
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
    onError: () => {
      setError('Error updating user data');
    },
  });

  const updateUser = (data: UserProfileChanges) => {
    return updateUserMutation.mutateAsync(data);
  };

  return {
    isLoading: enabled && isLoading,
    user,
    updateUser,
    refetchUser: refetch,
    error:
      error ??
      (queryError instanceof Error ? queryError.message : null),
  };
};
