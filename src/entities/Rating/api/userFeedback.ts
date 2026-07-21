import { backend } from '@/shared/api/backend';

import type { Rating, RatingPayload } from '../types';

interface UserFeedbackResponse {
  feedback: Rating | null;
}

export const getRating = async (): Promise<Rating | null> => {
  const response = await backend.invoke<UserFeedbackResponse>('user-feedback', {
    action: 'get',
  });

  return response.feedback;
};

export const submitRating = async (
  feedback: RatingPayload,
): Promise<Rating> => {
  const response = await backend.invoke<UserFeedbackResponse>('user-feedback', {
    action: 'submit',
    feedback,
  });

  if (!response.feedback) {
    throw new Error('FEEDBACK_NOT_SAVED');
  }

  return response.feedback;
};
