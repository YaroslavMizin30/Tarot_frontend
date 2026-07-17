import type { Activity } from '../types';

import { getDataFromDB } from '@/shared/api/supabase';

export const getActivity = async (userId: number): Promise<Activity | null> => {
  const data = await getDataFromDB<Activity>('activity', {
    key: 'userId',
    value: String(userId),
  }, { throwOnError: true });

  if (!data || data.length === 0) {
    return null;
  }

  return data[0];
};
