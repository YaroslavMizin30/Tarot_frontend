import { ensureSupabase } from '@/shared/api/supabase/ensureSupabase';
import {
  camelize,
  snakeize,
  toSnake,
} from '@/shared/api/http/http';

import type {
  BackendFilter,
  BackendGateway,
  BackendSelectOptions,
} from './types';

const applyFilters = <T>(query: T, filters: BackendFilter[] = []): T => {
  let filtered = query as T & {
    eq(column: string, value: unknown): T;
  };

  for (const filter of filters) {
    filtered = filtered.eq(toSnake(filter.column), filter.value) as typeof filtered;
  }

  return filtered as T;
};

const throwIfError = (error: { message?: string } | null) => {
  if (error) throw new Error(error.message || 'BACKEND_REQUEST_FAILED');
};

export const supabaseBackend: BackendGateway = {
  async select<T>(
    resource: string,
    options: BackendSelectOptions = {},
  ): Promise<T[]> {
    await ensureSupabase();

    let query = window.supabase
      .from(resource)
      .select(options.columns ?? '*');

    query = applyFilters(query, options.filters);

    for (const order of options.order ?? []) {
      query = query.order(toSnake(order.column), {
        ascending: order.ascending ?? true,
        nullsFirst: order.nullsFirst,
      });
    }

    if (options.range) {
      query = query.range(options.range.from, options.range.to);
    }

    const { data, error } = await query;
    throwIfError(error);
    return camelize<T[]>(data ?? []);
  },

  async insert<T>(
    resource: string,
    payload: Record<string, unknown>,
  ): Promise<T[]> {
    await ensureSupabase();
    const { data, error } = await window.supabase
      .from(resource)
      .insert(snakeize(payload))
      .select();
    throwIfError(error);
    return camelize<T[]>(data ?? []);
  },

  async update<T>(
    resource: string,
    payload: Record<string, unknown>,
    filters: BackendFilter[],
  ): Promise<T[]> {
    await ensureSupabase();
    let query = window.supabase
      .from(resource)
      .update(snakeize(payload));
    query = applyFilters(query, filters);
    const { data, error } = await query.select();
    throwIfError(error);
    return camelize<T[]>(data ?? []);
  },

  async remove(resource, filters): Promise<void> {
    await ensureSupabase();
    let query = window.supabase.from(resource).delete();
    query = applyFilters(query, filters);
    const { error } = await query;
    throwIfError(error);
  },

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

  async rpc<T>(
    operation: string,
    payload: Record<string, unknown> = {},
  ): Promise<T> {
    await ensureSupabase();
    const { data, error } = await window.supabase.rpc(
      operation,
      snakeize(payload),
    );
    throwIfError(error);
    return camelize<T>(data);
  },
};
