import snakeize from 'snakeize';

import { updateRaw } from '@/shared/api/supabase';

import { type AnalyticsPayload } from '../types';

export const sendAnalytics = async (userId: number, data: AnalyticsPayload) => {
  await updateRaw('analytics', snakeize(data), {
    key: 'telegram_user_id',
    value: userId,
  });
};
