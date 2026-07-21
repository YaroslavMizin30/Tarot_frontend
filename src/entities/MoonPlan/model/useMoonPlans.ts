import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createMoonPlan, deleteMoonPlan, getMoonPlans } from '../api/moonPlans';

import { useUser } from '@/entities/User';
import { queryKeys } from '@/shared/api/queryKeys';

export const useMoonPlans = (planDate: string | null) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const queryKey = queryKeys.moonPlans.byUserDate(
    user?.appUserId ?? 'no-user',
    planDate ?? 'no-date',
  );

  const query = useQuery({
    queryKey,
    queryFn: () => getMoonPlans(planDate!),
    enabled: Boolean(user && planDate),
  });

  const createMutation = useMutation({
    mutationFn: createMoonPlan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMoonPlan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    plans: query.data ?? [],
    isLoading: query.isPending,
    error: query.error ?? createMutation.error ?? deleteMutation.error,
    isSaving: createMutation.isPending,
    deletingId: deleteMutation.isPending ? deleteMutation.variables : null,
    createPlan: createMutation.mutateAsync,
    deletePlan: deleteMutation.mutateAsync,
  };
};
