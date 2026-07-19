import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getUser } from '@/entities/User/api/getUser/getUser';
import { updateUser as updateUserApi } from '@/entities/User/api/updateUser/updateUser';
import {
  authenticateWithTelegram,
  ensureSupabase,
} from '@/shared/api/supabase';
import { queryKeys } from '@/shared/api/queryKeys';
import type { User } from '../../../types/user';

export const useUser = () => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    refetch,
    error: queryError,
  } = useQuery({
    queryKey: queryKeys.user.current,
    queryFn: async () => {
      const { telegramId } = await authenticateWithTelegram();

      return getUser(telegramId);
    },
    retry: false,
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<User>;
    }) => {
      await ensureSupabase();
      return updateUserApi(id, data);
    },
    onSuccess: (updatedUser, variables) => {
      queryClient.setQueryData<User | null>(
        queryKeys.user.byId(variables.id),
        (currentUser) =>
          currentUser
            ? { ...currentUser, ...variables.data }
            : updatedUser,
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
    onError: () => {
      setError('Error updating user data');
    },
  });

  const updateUser = (id: string, data: Partial<User>) => {
    return updateUserMutation.mutateAsync({ id, data });
  };

  return {
    isLoading,
    user,
    updateUser,
    refetchUser: refetch,
    error:
      error ??
      (queryError instanceof Error ? queryError.message : null),
  };
};
