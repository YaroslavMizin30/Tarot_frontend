import type { Horoscope } from '../types';
import { backend } from '@/shared/api/backend';

export const getHoroscopes = async (
  appUserId: string,
): Promise<Horoscope[] | null> => {
  try {
    return await backend.select<Horoscope>('predictions', {
      filters: [{ column: 'appUserId', value: appUserId }],
      order: [{ column: 'date', ascending: true }],
    });
  } catch {
    return null;
  }
};
