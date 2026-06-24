/* eslint-disable @typescript-eslint/no-explicit-any */

interface HttpOptions<TBody = Record<string, any>> {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: TBody;
  params?: Record<string, string>;
}

/**
 * Convert snake_case to camelCase.
 * @example "user_name" -> "userName"
 */
const toCamel = (str: string): string =>
  str.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());

/**
 * Convert camelCase to snake_case.
 * @example "userName" -> "user_name"
 */
const toSnake = (str: string): string =>
  str.replace(/([A-Z])/g, '_$1').toLowerCase();

/**
 * Deeply transform all object keys from snake_case to camelCase.
 */
const camelize = <T>(obj: unknown): T => {
  if (Array.isArray(obj))
    return obj.map((item) => camelize(item)) as unknown as T;
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj as Record<string, unknown>).reduce(
      (acc, key) => {
        (acc as any)[toCamel(key)] = camelize((obj as any)[key]);
        return acc;
      },
      {} as Record<string, unknown>,
    ) as T;
  }
  return obj as unknown as T;
};

/**
 * Deeply transform all object keys from camelCase to snake_case.
 */
const snakeize = <T>(obj: unknown): T => {
  if (Array.isArray(obj))
    return obj.map((item) => snakeize(item)) as unknown as T;
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj as Record<string, unknown>).reduce(
      (acc, key) => {
        (acc as any)[toSnake(key)] = snakeize((obj as any)[key]);
        return acc;
      },
      {} as Record<string, unknown>,
    ) as T;
  }
  return obj as unknown as T;
};

/**
 * Generic HTTP client using XMLHttpRequest.
 *
 * - Automatically snakeizes the request body (camelCase -> snake_case).
 * - Automatically camelizes the response body (snake_case -> camelCase).
 * - Snakeizes query parameter keys as well (e.g. `{ userId: '123' }` -> `?user_id=123`).
 */
const http = <TResponse, TBody = Record<string, any>>(
  url: string,
  options: HttpOptions<TBody> = {},
): Promise<TResponse> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const { method = 'GET', headers = {}, body, params } = options;

    let fullUrl = url;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(toSnake(key), value);
      });
      fullUrl += `?${searchParams.toString()}`;
    }

    xhr.open(method, fullUrl);

    xhr.setRequestHeader('Content-Type', 'application/json');
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(camelize<TResponse>(response));
        } catch {
          resolve(xhr.responseText as unknown as TResponse);
        }
      } else {
        const error = new Error(`HTTP ${xhr.status}: ${xhr.statusText}`);
        (error as any).status = xhr.status;
        reject(error);
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error'));
    };

    const payload = body ? JSON.stringify(snakeize(body)) : undefined;
    xhr.send(payload);
  });
};

export { toCamel, toSnake, camelize, snakeize };
export type { HttpOptions };
export default http;
