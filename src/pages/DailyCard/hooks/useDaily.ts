import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { updateActivity, getActivity } from '@/entities/Activity';
import { useUser } from '@/entities/User';
import { queryKeys } from '@/shared/api/queryKeys';
import { getNextMidnight } from '@/shared/utils/getNextMidnight';
import { isToday } from '@/shared/utils/isToday';

export const useDaily = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const {
    data: activity,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.activity.byUserId(user?.id ?? 'no-user'),
    queryFn: () => getActivity(user!.id),
    enabled: !!user,
  });

  const updateActivityMutation = useMutation({
    mutationFn: async () => {
      if (user) {
        await updateActivity(user.id, {
          dailyCardLastDate: new Date().toISOString(),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
    },
  });

  const lastDate = activity?.dailyCardLastDate ?? null;
  const isAvailable = activity ? !isToday(lastDate!) : true;
  const nextAvailableAt = isAvailable ? null : getNextMidnight(lastDate ?? undefined);

  return {
    isAvailable,
    sign: user?.sign,
    isLoading,
    updateUserActivity: updateActivityMutation.mutateAsync,
    checkDaily: refetch,
    id: user?.id,
    error: null,
    nextAvailableAt,
    lastDate,
  };
};
