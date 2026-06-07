import { useEffect, useState } from 'react';

import { useUser } from '@/entities/User';

import { addRating } from '../api/addRating';
import { getRating } from '../api/getRating';
import { updateRating } from '../api/updateRating';
import type { Rating, RatingPayload } from '../types';

export const useRating = () => {
  const { user } = useUser();

  const [rating, setRating] = useState<Rating | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRating = async () => {
    if (!user) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await getRating(user.id);

      setRating(response);
      setHasRated(Boolean(response));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rating');
    } finally {
      setIsLoading(false);
    }
  };

  const submitRating = async (payload: RatingPayload): Promise<boolean> => {
    if (!user) {
      return false;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const result = hasRated
        ? await updateRating(user.id, payload)
        : await addRating(user.id, payload);

      setRating(result);
      setHasRated(true);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit rating');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchRating();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return {
    rating,
    isLoading,
    isSubmitting,
    hasRated,
    error,
    submitRating,
    refetch: fetchRating,
  };
};
