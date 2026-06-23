import { getDataFromDB } from '@/shared/api/supabase';

import type { Summary } from '../types';

export const getSummaries = async (
  userId: number,
): Promise<Summary[] | null> => {
  const data = await getDataFromDB<Summary>('spread_summaries', {
    key: 'userId',
    value: String(userId),
  });

  if (!data) {
    return null;
  }

  return data;
};
