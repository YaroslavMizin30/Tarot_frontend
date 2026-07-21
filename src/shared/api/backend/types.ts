export interface BackendGateway {
  invoke<T>(operation: string, payload?: Record<string, unknown>): Promise<T>;
}
