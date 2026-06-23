import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useUser } from '@/entities/User';
import { queryKeys } from '@/shared/api/queryKeys';

import { addRating } from '../api/addRating';
import { getRating } from '../api/getRating';
import { updateRating } from '../api/updateRating';
import type { RatingPayload } from '../types';

export const useRating = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const {
    data: rating,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.rating.byUserId(user?.id ?? 'no-user'),
    queryFn: () => getRating(user!.id),
    enabled: !!user,
  });

  const submitMutation = useMutation({
    mutationFn: async (payload: RatingPayload) => {
      if (!user) {
        return false;
      }

      const hasRated = !!rating;

      const result = hasRated
        ? await updateRating(user.id, payload)
        : await addRating(user.id, payload);

      return !!result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rating.all });
    },
  });

  return {
    rating,
    isLoading,
    isSubmitting: submitMutation.isPending,
    hasRated: !!rating,
    error: submitMutation.error?.message ?? null,
    submitRating: submitMutation.mutateAsync,
    refetch,
  };
};
