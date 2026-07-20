import type { CreateMoonPlanPayload, MoonPlan } from '../types';

import { backend } from '@/shared/api/backend';

export const getMoonPlans = (
  appUserId: string,
  planDate: string,
): Promise<MoonPlan[]> => {
  return backend.select<MoonPlan>('moon_plans', {
    filters: [
      { column: 'appUserId', value: appUserId },
      { column: 'planDate', value: planDate },
      { column: 'status', value: 'pending' },
    ],
    order: [{ column: 'createdAt', ascending: true }],
  });
};

export const createMoonPlan = async (
  payload: CreateMoonPlanPayload,
): Promise<MoonPlan> => {
  const [plan] = await backend.insert<MoonPlan>('moon_plans', {
    ...payload,
  });
  if (!plan) throw new Error('MOON_PLAN_CREATE_FAILED');
  return plan;
};

export const deleteMoonPlan = async (id: string): Promise<void> => {
  await backend.remove('moon_plans', [
    { column: 'id', value: id },
    { column: 'status', value: 'pending' },
  ]);
};
