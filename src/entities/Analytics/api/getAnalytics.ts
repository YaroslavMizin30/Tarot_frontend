import { getDataFromDB } from '@/shared/api/supabase';

import { type AnalyticsPayload } from '../types';

export const getAnalytics = async (appUserId: string) => {
  const data = await getDataFromDB<AnalyticsPayload>('analytics', {
    key: 'appUserId',
    value: appUserId,
  });

  if (!data) {
    return null;
  }

  return data[0];
};
