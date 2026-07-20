import type { Activity } from '../types';

import { getDataFromDB } from '@/shared/api/supabase';

export const getActivity = async (
  appUserId: string,
): Promise<Activity | null> => {
  const data = await getDataFromDB<Activity>('activity', {
    key: 'appUserId',
    value: appUserId,
  }, { throwOnError: true });

  if (!data || data.length === 0) {
    return null;
  }

  return data[0];
};
