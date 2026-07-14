import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getUser } from '@/entities/User/api/getUser/getUser';
import { updateUser as updateUserApi } from '@/entities/User/api/updateUser/updateUser';
import getTelegramUser from '@/entities/TelegramUser';
import { ensureSupabase } from '@/shared/api/supabase';
import { queryKeys } from '@/shared/api/queryKeys';
import type { User } from '../../../types/user';

export const useUser = () => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const telegramUser = getTelegramUser();
  const telegramId = telegramUser?.id;

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.user.byId(telegramId ?? 'no-user'),
    queryFn: async () => {
      await ensureSupabase();

      return getUser(telegramId!);
    },
    enabled: !!telegramId,
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
    onSuccess: () => {
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
    error,
  };
};
