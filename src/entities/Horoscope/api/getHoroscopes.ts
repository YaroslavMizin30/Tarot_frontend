import http from '@/shared/api/http/http';

import type { Horoscope } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const session = await window.supabase?.auth.getSession();
  const token = session?.data?.session?.access_token;

  return {
    apikey: supabaseKey,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getHoroscopes = async (
  userId: string,
): Promise<Horoscope[] | null> => {
  try {
    const headers = await getAuthHeaders();

    const data = await http<Horoscope[]>(
      `${supabaseUrl}/rest/v1/predictions`,
      {
        method: 'GET',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        params: {
          select: '*',
          userId: `eq.${userId}`,
          order: 'date.desc',
        },
      },
    );

    return data;
  } catch {
    return null;
  }
};
