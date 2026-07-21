import type { CreateMoonPlanPayload, MoonPlan } from '../types';

import { backend } from '@/shared/api/backend';

export const getMoonPlans = (
  planDate: string,
): Promise<MoonPlan[]> => {
  return backend
    .invoke<{ plans: MoonPlan[] }>('moon-plans', {
      action: 'list',
      planDate,
    })
    .then(({ plans }) => plans);
};

export const createMoonPlan = async (
  payload: CreateMoonPlanPayload,
): Promise<MoonPlan> => {
  const { plan } = await backend.invoke<{ plan: MoonPlan }>('moon-plans', {
    action: 'create',
    ...payload,
  });
  return plan;
};

export const deleteMoonPlan = async (id: string): Promise<void> => {
  await backend.invoke<{ deletedId: string }>('moon-plans', {
    action: 'delete',
    id,
  });
};
