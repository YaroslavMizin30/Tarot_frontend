import snakeize from 'snakeize';

import { v4 } from 'uuid';

import { insertRaw, updateRaw } from '@/shared/api/supabase';

export const addSummary = async (userId: number, summary: string) => {
  const uuid = v4();
  const date = new Date().toISOString();

  await insertRaw('spread_summaries', snakeize({ summary, userId, date, id: uuid }));

  await updateRaw('spreads', snakeize({ isSummarized: true }), {
    key: 'user_id',
    value: userId,
  });

  return { id: uuid, summary, date: new Date(date).toLocaleDateString() };
};
