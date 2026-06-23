import type { Activity } from '../types';

import { getActivity } from './getActivity';

import { updateRaw, insertRaw } from '@/shared/api/supabase';

export const updateActivity = async (
  userId: number,
  activity: Partial<Activity>,
) => {
  const userActivity = await getActivity(userId);

  if (userActivity) {
    await updateRaw('activity', { ...activity }, {
      key: 'userId',
      value: userId,
    });
  } else {
    await insertRaw('activity', {
      ...activity,
      userId,
    });
  }
};
