import camelize from 'camelize';

import type { CreateMoonPlanPayload, MoonPlan } from '../types';

import { ensureSupabase } from '@/shared/api/supabase';

export const getMoonPlans = async (
  userId: number,
  planDate: string,
): Promise<MoonPlan[]> => {
  await ensureSupabase();

  const { data, error } = await window.supabase
    .from('moon_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('plan_date', planDate)
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return camelize(data ?? []) as MoonPlan[];
};

export const createMoonPlan = async (
  payload: CreateMoonPlanPayload,
): Promise<MoonPlan> => {
  await ensureSupabase();

  const { data, error } = await window.supabase
    .from('moon_plans')
    .insert({
      user_id: payload.userId,
      plan_date: payload.planDate,
      text: payload.text,
      locale: payload.locale,
      timezone: payload.timezone,
      notification_time: payload.notificationTime,
    })
    .select('*')
    .single();

  if (error) throw error;
  return camelize(data) as MoonPlan;
};

export const deleteMoonPlan = async (id: string): Promise<void> => {
  await ensureSupabase();

  const { error } = await window.supabase
    .from('moon_plans')
    .delete()
    .eq('id', id)
    .eq('status', 'pending');

  if (error) throw error;
};
