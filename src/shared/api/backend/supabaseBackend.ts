import { ensureSupabase } from '@/shared/api/supabase/ensureSupabase';
import type { BackendGateway } from './types';

const throwIfError = (error: { message?: string } | null) => {
  if (error) throw new Error(error.message || 'BACKEND_REQUEST_FAILED');
};

export const supabaseBackend: BackendGateway = {
  async invoke<T>(
    operation: string,
    payload?: Record<string, unknown>,
  ): Promise<T> {
    await ensureSupabase();
    const { data, error } = await window.supabase.functions.invoke<T>(
      operation,
      payload === undefined ? undefined : { body: payload },
    );
    throwIfError(error);
    if (data === null || data === undefined) {
      throw new Error('BACKEND_EMPTY_RESPONSE');
    }
    return data;
  },
};
