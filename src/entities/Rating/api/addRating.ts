import snakeize from 'snakeize';

import { insertRaw } from '@/shared/api/supabase';

import type { Rating, RatingPayload } from '../types';

export const addRating = async (
  userId: number,
  payload: RatingPayload,
): Promise<Rating> => {
  const { error } = await insertRaw<Rating>(
    'app_ratings',
    snakeize({ ...payload, userId }),
  );

  if (error) {
    throw error;
  }

  return { ...payload, userId };
};
