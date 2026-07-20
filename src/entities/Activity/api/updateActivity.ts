import type { Activity } from '../types';

import { getActivity } from './getActivity';

import { updateRaw, insertRaw } from '@/shared/api/supabase';

export const updateActivity = async (
  appUserId: string,
  profileId: number,
  activity: Partial<Activity>,
) => {
  const userActivity = await getActivity(appUserId);

  if (userActivity) {
    const updatedActivity = await updateRaw<Activity>(
      'activity',
      { ...activity },
      {
        key: 'appUserId',
        value: appUserId,
      },
    );

    if (!updatedActivity?.length) {
      throw new Error('Failed to update activity');
    }
  } else {
    const insertedActivity = await insertRaw<Activity>('activity', {
      ...activity,
      userId: profileId,
      appUserId,
    });

    if (!insertedActivity?.length) {
      throw new Error('Failed to create activity');
    }
  }
};
