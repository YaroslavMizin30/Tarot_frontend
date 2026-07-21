import type { Activity, ActivityPatch } from '../types';

import { backend } from '@/shared/api/backend';

interface ActivityResponse {
  activity: Activity;
}

export const updateActivity = async (
  activity: ActivityPatch,
): Promise<Activity> => {
  if (!activity.dailyCardLastDate) {
    throw new Error('Invalid daily card reveal');
  }

  const response = await backend.invoke<ActivityResponse>('user-activity', {
    action: 'revealDailyCard',
  });

  return response.activity;
};
