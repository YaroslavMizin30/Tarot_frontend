export type BackendValue = string | number | boolean | null;

export interface BackendFilter {
  column: string;
  value: BackendValue;
}

export interface BackendOrder {
  column: string;
  ascending?: boolean;
  nullsFirst?: boolean;
}

export interface BackendRange {
  from: number;
  to: number;
}

export interface BackendSelectOptions {
  columns?: string;
  filters?: BackendFilter[];
  order?: BackendOrder[];
  range?: BackendRange;
}

export interface BackendGateway {
  select<T>(resource: string, options?: BackendSelectOptions): Promise<T[]>;
  insert<T>(resource: string, payload: Record<string, unknown>): Promise<T[]>;
  update<T>(
    resource: string,
    payload: Record<string, unknown>,
    filters: BackendFilter[],
  ): Promise<T[]>;
  remove(resource: string, filters: BackendFilter[]): Promise<void>;
  invoke<T>(operation: string, payload?: Record<string, unknown>): Promise<T>;
  rpc<T>(operation: string, payload?: Record<string, unknown>): Promise<T>;
}
