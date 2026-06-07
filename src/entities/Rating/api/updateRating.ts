import snakeize from 'snakeize';

import { updateRaw } from '@/shared/api/supabase';

import type { Rating, RatingPayload } from '../types';

export const updateRating = async (
  userId: number,
  payload: RatingPayload,
): Promise<Rating> => {
  const { error } = await updateRaw<Rating>(
    'app_ratings',
    snakeize({ ...payload }),
    {
      key: 'user_id',
      value: userId,
    },
  );

  if (error) {
    throw error;
  }

  return { ...payload, userId };
};
