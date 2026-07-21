import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getActivity } from '../api/getActivity';
import { updateActivity as updateActivityApi } from '../api/updateActivity';
import { useUser } from '@/entities/User';
import { queryKeys } from '@/shared/api/queryKeys';
import type { Activity, ActivityPatch } from '../types';

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
    queryKey: queryKeys.activity.byUserId(user?.appUserId ?? 'no-user'),
    queryFn: getActivity,
    enabled: !!user,
  });

  const updateActivityMutation = useMutation({
    mutationFn: (activity: ActivityPatch) => {
      if (!user) {
        throw new Error('User not found');
      }

      return updateActivityApi(activity);
    },
    onMutate: async (nextActivity) => {
      const activityQueryKey = queryKeys.activity.byUserId(
        user?.appUserId ?? 'no-user',
      );

      await queryClient.cancelQueries({ queryKey: activityQueryKey });

      const previousActivity = queryClient.getQueryData<Activity | null>(
        activityQueryKey,
      );

      queryClient.setQueryData<Activity>(activityQueryKey, {
        ...previousActivity,
        ...nextActivity,
      });

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
    onSuccess: (savedActivity) => {
      queryClient.setQueryData(
        queryKeys.activity.byUserId(user?.appUserId ?? 'no-user'),
        savedActivity,
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
    },
  });

  const updateActivity = (activity: ActivityPatch) => {
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
