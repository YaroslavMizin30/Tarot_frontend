import type { Activity } from '../types';

import { getActivity } from './getActivity';

import { updateRaw, insertRaw } from '@/shared/api/supabase';

export const updateActivity = async (
  userId: number,
  activity: Partial<Activity>,
) => {
  const userActivity = await getActivity(userId);

  if (userActivity) {
    const updatedActivity = await updateRaw<Activity>(
      'activity',
      { ...activity },
      {
        key: 'userId',
        value: userId,
      },
    );

    if (!updatedActivity?.length) {
      throw new Error('Failed to update activity');
    }
  } else {
    const insertedActivity = await insertRaw<Activity>('activity', {
      ...activity,
      userId,
    });

    if (!insertedActivity?.length) {
      throw new Error('Failed to create activity');
    }
  }
};
