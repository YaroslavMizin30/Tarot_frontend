import type { Horoscope } from '../types';

export const getHoroscopes = async (
  userId: string,
): Promise<Horoscope[] | null> => {
  try {
    const { data } = await window.supabase
      .from('predictions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });

    return data as Horoscope[] | null;
  } catch {
    return null;
  }
};
