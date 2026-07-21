import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useUser } from '@/entities/User';
import { queryKeys } from '@/shared/api/queryKeys';

import {
  getRating,
  submitRating as submitRatingApi,
} from '../api/userFeedback';
import type { RatingPayload } from '../types';

export const useRating = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const {
    data: rating,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.rating.byUserId(user?.appUserId ?? 'no-user'),
    queryFn: getRating,
    enabled: !!user,
  });

  const submitMutation = useMutation({
    mutationFn: (payload: RatingPayload) => {
      if (!user) {
        return Promise.reject(new Error('USER_NOT_AUTHENTICATED'));
      }

      return submitRatingApi(payload);
    },
    onSuccess: (submittedRating) => {
      if (!user) return;

      queryClient.setQueryData(
        queryKeys.rating.byUserId(user.appUserId),
        submittedRating,
      );
    },
  });

  return {
    rating,
    isLoading,
    isSubmitting: submitMutation.isPending,
    hasRated: !!rating,
    error: submitMutation.error?.message ?? null,
    submitRating: async (payload: RatingPayload) => {
      try {
        await submitMutation.mutateAsync(payload);
        return true;
      } catch {
        return false;
      }
    },
    refetch,
  };
};
