import http from '../../http/http';

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

export const insertRaw = async <T>(
  table: string,
  columns: Record<string, unknown>,
): Promise<T[] | null> => {
  try {
    const headers = await getAuthHeaders();
    const data = await http<T[]>(
      `${supabaseUrl}/rest/v1/${table}`,
      {
        method: 'POST',
        headers: {
          ...headers,
          'Prefer': 'return=representation',
        },
        body: columns,
      },
    );
    return data;
  } catch {
    return null;
  }
};
