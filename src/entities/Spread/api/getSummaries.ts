import camelize from 'camelize';

import { getDataFromDB } from '@/shared/api/supabase';

import type { Summary, SummaryResponse } from '../types';

export const getSummaries = async (
  userId: number,
): Promise<Summary[] | null> => {
  const { data } = await getDataFromDB<SummaryResponse>('summaries', ['*'], {
    key: 'user_id',
    value: String(userId),
  });

  if (!data) {
    return null;
  }

  return camelize(data);
};
