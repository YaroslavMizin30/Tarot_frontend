import { getDataFromDB } from '@/shared/api/supabase';

import { type AnalyticsPayload } from '../types';

export const getAnalytics = async (userId: number) => {
  const data = await getDataFromDB<AnalyticsPayload>('analytics', {
    key: 'telegramUserId',
    value: String(userId),
  });

  if (!data) {
    return null;
  }

  return data[0];
};
