import type { Activity } from '../types';

import { backend } from '@/shared/api/backend';

interface ActivityResponse {
  activity: Activity | null;
}

export const getActivity = async (): Promise<Activity | null> => {
  const response = await backend.invoke<ActivityResponse>('user-activity', {
    action: 'get',
  });

  return response.activity;
};
