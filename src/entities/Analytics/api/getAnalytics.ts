import camelize from 'camelize';

import { getDataFromDB } from '@/shared/api/supabase';

import { type AnalyticsUserState } from '../types';

export const getAnalytics = async (userId: number) => {
  const { data } = await getDataFromDB<AnalyticsUserState>('analytics', ['*'], {
    key: 'telegram_user_id',
    value: String(userId),
  });

  if (!data) {
    return null;
  }

  return camelize(data[0]);
};
