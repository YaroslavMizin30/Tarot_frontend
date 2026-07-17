import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getActivity } from '../api/getActivity';
import { updateActivity as updateActivityApi } from '../api/updateActivity';
import { useUser } from '@/entities/User';
import { queryKeys } from '@/shared/api/queryKeys';
import type { Activity } from '../types';

export const useActivity = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const {
    data: activity,
    error,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.activity.byUserId(user?.id ?? 'no-user'),
    queryFn: () => getActivity(user!.id),
    enabled: !!user,
  });

  const updateActivityMutation = useMutation({
    mutationFn: (activity: Partial<Activity>) => {
      if (!user) {
        throw new Error('User not found');
      }

      return updateActivityApi(user.id, activity);
    },
    onMutate: async (nextActivity) => {
      const activityQueryKey = queryKeys.activity.byUserId(
        user?.id ?? 'no-user',
      );

      await queryClient.cancelQueries({ queryKey: activityQueryKey });

      const previousActivity = queryClient.getQueryData<Activity | null>(
        activityQueryKey,
      );

      if (previousActivity) {
        queryClient.setQueryData<Activity>(activityQueryKey, {
          ...previousActivity,
          ...nextActivity,
        });
      }

      return { activityQueryKey, previousActivity };
    },
    onError: (_error, _activity, context) => {
      if (context) {
        queryClient.setQueryData(
          context.activityQueryKey,
          context.previousActivity,
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
    },
  });

  const updateActivity = (activity: Partial<Activity>) => {
    return updateActivityMutation.mutateAsync(activity);
  };

  return {
    isLoading,
    isFetching,
    error,
    activity: activity ?? null,
    updateActivity,
    refetchActivity: refetch,
  };
};
