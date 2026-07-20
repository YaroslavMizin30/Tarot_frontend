import { updateRaw } from '@/shared/api/supabase';

import { type AnalyticsPayload } from '../types';

export const sendAnalytics = async (
  appUserId: string,
  data: Partial<AnalyticsPayload>,
) => {
  await updateRaw('analytics', data, {
    key: 'appUserId',
    value: appUserId,
  });
};
