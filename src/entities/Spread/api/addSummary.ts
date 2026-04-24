import snakeize from 'snakeize';

import { v4 } from 'uuid';

import { insertRaw } from '@/shared/api/supabase';

export const addSummary = async (userId: number, summary: string) => {
  await insertRaw(
    'summaries',
    snakeize({ summary, userId, date: new Date().toString(), id: v4() }),
  );
};
