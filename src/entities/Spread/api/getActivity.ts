import camelize from 'camelize';

import type { ActivityResponse, Activity } from '../types';

import { getDataFromDB } from '@/shared/api/supabase';

export const getActivity = async (userId: number): Promise<Activity | null> => {
  const { data } = await getDataFromDB<ActivityResponse>('activity', ['*'], {
    key: 'user_id',
    value: String(userId),
  });

  if (!data) {
    return null;
  }

  return camelize(data[0]);
};
