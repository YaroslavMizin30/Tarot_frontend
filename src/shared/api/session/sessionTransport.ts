import { createMemorySessionStore } from './memorySessionStore';
import type {
  ApplicationSession,
  FetchLike,
  PlatformProof,
  PlatformProofProvider,
  SessionRequestInit,
  SessionStore,
  SessionTransport,
} from './types';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ERROR_CODE_PATTERN = /^[A-Z0-9_]{1,80}$/;
const API_PATH_PATTERN = /^\/v1\/[a-zA-Z0-9/%_.-]*$/;
const DEFAULT_REQUEST_TIMEOUT_MS = 10_000;
const DEFAULT_REFRESH_SKEW_MS = 30_000;

type JsonObject = Record<string, unknown>;

interface SessionTransportOptions {
  allowInsecureLocalhost?: boolean;
  apiBaseUrl: string;
  fetcher?: FetchLike;
  now?: () => number;
  proofProvider: PlatformProofProvider;
  refreshSkewMs?: number;
  requestTimeoutMs?: number;
  store?: SessionStore;
}

interface TokenPair {
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken: string;
  refreshTokenExpiresAt: number;
  sessionId: string;
}

export class SessionTransportError extends Error {
  readonly code: string;
  readonly status?: number;

  constructor(
    code: string,
    options: { cause?: unknown; status?: number } = {},
  ) {
    super(code, options.cause === undefined ? undefined : {
      cause: options.cause,
    });
    this.name = 'SessionTransportError';
    this.code = code;
    this.status = options.status;
  }
}

const isObject = (value: unknown): value is JsonObject =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const parseTimestamp = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
};

const readRequiredString = (value: JsonObject, key: string) => {
  const candidate = value[key];
  return typeof candidate === 'string' && candidate.length > 0
    ? candidate
    : null;
};

const parseTokenPair = (value: unknown): TokenPair | null => {
  if (!isObject(value)) return null;

  const accessToken = readRequiredString(value, 'accessToken');
  const refreshToken = readRequiredString(value, 'refreshToken');
  const sessionId = readRequiredString(value, 'sessionId');
  const accessTokenExpiresAt = parseTimestamp(value.accessTokenExpiresAt);
  const refreshTokenExpiresAt = parseTimestamp(value.refreshTokenExpiresAt);

  if (
    !accessToken ||
    !refreshToken ||
    !sessionId ||
    !UUID_PATTERN.test(sessionId) ||
    accessTokenExpiresAt === null ||
    refreshTokenExpiresAt === null ||
    value.tokenType !== 'Bearer'
  ) {
    return null;
  }

  return {
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    refreshTokenExpiresAt,
    sessionId,
  };
};

const parseExchangeSession = (value: unknown): ApplicationSession | null => {
  if (!isObject(value)) return null;

  const pair = parseTokenPair(value);
  const appUserId = readRequiredString(value, 'appUserId');

  if (!pair || !appUserId || !UUID_PATTERN.test(appUserId)) return null;

  return { ...pair, appUserId };
};

const normalizeApiBaseUrl = (
  value: string,
  allowInsecureLocalhost: boolean,
) => {
  try {
    const url = new URL(value);
    const localDevelopment = allowInsecureLocalhost &&
      ['localhost', '127.0.0.1'].includes(url.hostname);

    if (url.protocol !== 'https:' && !localDevelopment) {
      throw new Error('insecure protocol');
    }

    url.hash = '';
    url.search = '';
    url.pathname = url.pathname.replace(/\/+$/, '');
    return url.toString().replace(/\/+$/, '');
  } catch (error) {
    throw new SessionTransportError('SESSION_API_URL_INVALID', {
      cause: error,
    });
  }
};

const readErrorCode = async (response: Response) => {
  try {
    const value: unknown = await response.clone().json();
    const code = isObject(value) &&
      isObject(value.error) &&
      typeof value.error.code === 'string'
      ? value.error.code
      : null;

    if (code && ERROR_CODE_PATTERN.test(code)) return code;
  } catch {
    // The HTTP status below is the safe fallback for malformed error bodies.
  }

  return `SESSION_HTTP_${response.status}`;
};

const readJson = async (response: Response) => {
  try {
    return await response.json() as unknown;
  } catch (error) {
    throw new SessionTransportError('SESSION_RESPONSE_INVALID', {
      cause: error,
      status: response.status,
    });
  }
};

class DefaultSessionTransport implements SessionTransport {
  private readonly apiBaseUrl: string;
  private readonly fetcher: FetchLike;
  private readonly now: () => number;
  private readonly proofProvider: PlatformProofProvider;
  private readonly refreshSkewMs: number;
  private readonly requestTimeoutMs: number;
  private readonly store: SessionStore;
  private renewalPromise: Promise<ApplicationSession> | null = null;

  constructor(options: SessionTransportOptions) {
    this.apiBaseUrl = normalizeApiBaseUrl(
      options.apiBaseUrl,
      options.allowInsecureLocalhost === true,
    );
    this.fetcher = options.fetcher ?? fetch.bind(globalThis);
    this.now = options.now ?? Date.now;
    this.proofProvider = options.proofProvider;
    this.refreshSkewMs =
      options.refreshSkewMs ?? DEFAULT_REFRESH_SKEW_MS;
    this.requestTimeoutMs =
      options.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;
    this.store = options.store ?? createMemorySessionStore();
  }

  clear = async () => {
    this.renewalPromise = null;
    await this.store.clear();
  };

  establishSession = async () => {
    const session = await this.store.read();
    if (this.hasUsableAccessToken(session)) return session;

    return this.runRenewal(async () => {
      const current = await this.store.read();
      if (this.hasUsableAccessToken(current)) return current;
      return this.rotateOrExchange(current);
    });
  };

  logout = async (options: { all?: boolean } = {}) => {
    try {
      const session = await this.store.read();
      if (!session) return;

      await this.request(
        options.all ? '/v1/auth/logout-all' : '/v1/auth/logout',
        { method: 'POST' },
      );
    } finally {
      await this.clear();
    }
  };

  request = async (path: string, init: SessionRequestInit = {}) => {
    this.assertApiPath(path);
    const session = await this.establishSession();
    const response = await this.authenticatedFetch(path, session, init);

    if (response.status !== 401) return this.requireSuccess(response);

    const renewed = await this.renewAfterUnauthorized(session.accessToken);
    const retry = await this.authenticatedFetch(path, renewed, init);
    return this.requireSuccess(retry);
  };

  requestJson = async <T>(
    path: string,
    init: SessionRequestInit = {},
  ) => {
    const response = await this.request(path, init);
    if (response.status === 204) return undefined as T;
    return await readJson(response) as T;
  };

  private assertApiPath(path: string) {
    let parsed: URL;
    try {
      parsed = new URL(path, 'https://session-transport.invalid');
    } catch {
      throw new SessionTransportError('SESSION_REQUEST_PATH_INVALID');
    }

    if (
      !path.startsWith('/v1/') ||
      path.startsWith('//') ||
      parsed.origin !== 'https://session-transport.invalid' ||
      parsed.hash !== '' ||
      !API_PATH_PATTERN.test(parsed.pathname)
    ) {
      throw new SessionTransportError('SESSION_REQUEST_PATH_INVALID');
    }
  }

  private authenticatedFetch(
    path: string,
    session: ApplicationSession,
    init: SessionRequestInit,
  ) {
    const headers = new Headers(init.headers);
    headers.set('accept', 'application/json');
    headers.set('authorization', `Bearer ${session.accessToken}`);

    return this.fetchWithTimeout(`${this.apiBaseUrl}${path}`, {
      ...init,
      cache: 'no-store',
      credentials: 'omit',
      headers,
      referrerPolicy: 'no-referrer',
    });
  }

  private exchangeSession = async () => {
    const proof = this.proofProvider.read();
    if (!this.isUsableProof(proof)) {
      throw new SessionTransportError('SESSION_PLATFORM_PROOF_UNAVAILABLE');
    }

    const response = await this.fetchWithTimeout(
      `${this.apiBaseUrl}/v1/auth/platform/exchange`,
      {
        body: JSON.stringify(proof),
        cache: 'no-store',
        credentials: 'omit',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        method: 'POST',
        referrerPolicy: 'no-referrer',
      },
    );
    await this.requireSuccess(response);

    const session = parseExchangeSession(await readJson(response));
    if (!session) {
      throw new SessionTransportError('SESSION_EXCHANGE_RESPONSE_INVALID');
    }

    await this.store.write(session);
    return session;
  };

  private fetchWithTimeout = async (
    input: Parameters<FetchLike>[0],
    init: SessionRequestInit,
  ) => {
    const abortController = new AbortController();
    const timeout = globalThis.setTimeout(
      () => abortController.abort(),
      this.requestTimeoutMs,
    );

    try {
      return await this.fetcher(input, {
        ...init,
        signal: abortController.signal,
      });
    } catch (error) {
      const timeoutReached = error instanceof DOMException &&
        error.name === 'AbortError';
      throw new SessionTransportError(
        timeoutReached
          ? 'SESSION_REQUEST_TIMEOUT'
          : 'SESSION_NETWORK_ERROR',
        { cause: error },
      );
    } finally {
      globalThis.clearTimeout(timeout);
    }
  };

  private hasUsableAccessToken(
    session: ApplicationSession | null,
  ): session is ApplicationSession {
    return session !== null &&
      session.accessTokenExpiresAt > this.now() + this.refreshSkewMs;
  }

  private hasUsableRefreshToken(
    session: ApplicationSession | null,
  ): session is ApplicationSession {
    return session !== null &&
      session.refreshTokenExpiresAt > this.now() + this.refreshSkewMs;
  }

  private isUsableProof(proof: PlatformProof | null): proof is PlatformProof {
    return proof !== null &&
      proof.proof.length > 0 &&
      ['telegram', 'vk', 'max'].includes(proof.platform);
  }

  private refreshSession = async (current: ApplicationSession) => {
    const response = await this.fetchWithTimeout(
      `${this.apiBaseUrl}/v1/auth/refresh`,
      {
        body: JSON.stringify({ refreshToken: current.refreshToken }),
        cache: 'no-store',
        credentials: 'omit',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        method: 'POST',
        referrerPolicy: 'no-referrer',
      },
    );

    if (!response.ok) {
      const error = await this.toResponseError(response);
      if (response.status === 400 || response.status === 401) {
        await this.store.clear();
      }
      throw error;
    }

    const pair = parseTokenPair(await readJson(response));
    if (!pair) {
      await this.store.clear();
      throw new SessionTransportError('SESSION_REFRESH_RESPONSE_INVALID');
    }

    const session = { ...pair, appUserId: current.appUserId };
    await this.store.write(session);
    return session;
  };

  private renewAfterUnauthorized = (staleAccessToken: string) =>
    this.runRenewal(async () => {
      const current = await this.store.read();

      if (
        this.hasUsableAccessToken(current) &&
        current.accessToken !== staleAccessToken
      ) {
        return current;
      }

      return this.rotateOrExchange(current);
    });

  private requireSuccess = async (response: Response) => {
    if (!response.ok) throw await this.toResponseError(response);
    return response;
  };

  private rotateOrExchange = async (
    session: ApplicationSession | null,
  ) => {
    if (this.hasUsableRefreshToken(session)) {
      try {
        return await this.refreshSession(session);
      } catch (error) {
        if (
          !(error instanceof SessionTransportError) ||
          (error.status !== 400 && error.status !== 401)
        ) {
          throw error;
        }
      }
    }

    return this.exchangeSession();
  };

  private runRenewal(task: () => Promise<ApplicationSession>) {
    if (this.renewalPromise) return this.renewalPromise;

    const promise = task();
    this.renewalPromise = promise;

    promise.finally(() => {
      if (this.renewalPromise === promise) this.renewalPromise = null;
    }).catch(() => undefined);

    return promise;
  }

  private toResponseError = async (response: Response) =>
    new SessionTransportError(await readErrorCode(response), {
      status: response.status,
    });
}

export const createSessionTransport = (
  options: SessionTransportOptions,
): SessionTransport => new DefaultSessionTransport(options);

export type { SessionTransportOptions };
