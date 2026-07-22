import { getHostPlatform } from '@/shared/lib/hostPlatform';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ERROR_CODE_PATTERN = /^[A-Z0-9_]{1,80}$/;
const STATUS_STORAGE_KEY = 'tarotopia:platform-auth-canary-status';
const REQUEST_TIMEOUT_MS = 10_000;

type PlatformAuthCanaryResult =
  | { status: 'skipped' }
  | { appUserId: string; status: 'succeeded' }
  | { code: string; status: 'failed' };

let exchangePromise: Promise<PlatformAuthCanaryResult> | null = null;

const saveStatus = (result: Exclude<PlatformAuthCanaryResult, { status: 'skipped' }>) => {
  try {
    window.sessionStorage.setItem(
      STATUS_STORAGE_KEY,
      JSON.stringify({
        ...(result.status === 'failed' ? { code: result.code } : {}),
        at: new Date().toISOString(),
        status: result.status,
      }),
    );
  } catch {
    // Canary diagnostics must never block the established auth flow.
  }
};

const getErrorCode = async (response: Response) => {
  try {
    const candidate: unknown = await response.json();
    const code = (
      typeof candidate === 'object' &&
      candidate !== null &&
      'error' in candidate &&
      typeof candidate.error === 'object' &&
      candidate.error !== null &&
      'code' in candidate.error
    )
      ? candidate.error.code
      : null;

    if (typeof code === 'string' && ERROR_CODE_PATTERN.test(code)) {
      return code;
    }
  } catch {
    // An invalid error body is represented by the safe HTTP status below.
  }

  return `PLATFORM_AUTH_CANARY_HTTP_${response.status}`;
};

const getApiUrl = () => {
  const configured = import.meta.env.VITE_PLATFORM_AUTH_API_URL?.trim();

  if (!configured) return null;

  try {
    const url = new URL(configured);
    const localDevelopment = import.meta.env.DEV &&
      ['localhost', '127.0.0.1'].includes(url.hostname);

    if (url.protocol !== 'https:' && !localDevelopment) return null;

    return url.toString().replace(/\/+$/, '');
  } catch {
    return null;
  }
};

const exchangePlatformProof = async (): Promise<PlatformAuthCanaryResult> => {
  if (import.meta.env.VITE_PLATFORM_AUTH_CANARY_ENABLED !== 'true') {
    return { status: 'skipped' };
  }

  const hostPlatform = getHostPlatform();
  const apiUrl = getApiUrl();
  const proof = hostPlatform.getAuthPayload();

  if (hostPlatform.kind !== 'telegram' || !apiUrl || !proof) {
    const failed = {
      code: 'PLATFORM_AUTH_CANARY_CONFIG_INVALID',
      status: 'failed' as const,
    };
    saveStatus(failed);
    return failed;
  }

  const abortController = new AbortController();
  const timeout = window.setTimeout(
    () => abortController.abort(),
    REQUEST_TIMEOUT_MS,
  );

  try {
    const response = await fetch(`${apiUrl}/v1/auth/platform/exchange`, {
      body: JSON.stringify({
        clientLabel: 'telegram-mini-app-canary',
        platform: 'telegram',
        proof,
      }),
      cache: 'no-store',
      credentials: 'omit',
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      referrerPolicy: 'no-referrer',
      signal: abortController.signal,
    });

    if (!response.ok) {
      const failed = {
        code: await getErrorCode(response),
        status: 'failed' as const,
      };
      saveStatus(failed);
      return failed;
    }

    const candidate: unknown = await response.json();
    const appUserId = (
      typeof candidate === 'object' &&
      candidate !== null &&
      'appUserId' in candidate
    )
      ? candidate.appUserId
      : null;

    if (typeof appUserId !== 'string' || !UUID_PATTERN.test(appUserId)) {
      const failed = {
        code: 'PLATFORM_AUTH_CANARY_RESPONSE_INVALID',
        status: 'failed' as const,
      };
      saveStatus(failed);
      return failed;
    }

    const succeeded = { appUserId, status: 'succeeded' as const };
    saveStatus(succeeded);
    return succeeded;
  } catch (error) {
    const failed = {
      code: error instanceof DOMException && error.name === 'AbortError'
        ? 'PLATFORM_AUTH_CANARY_TIMEOUT'
        : 'PLATFORM_AUTH_CANARY_NETWORK_ERROR',
      status: 'failed' as const,
    };
    saveStatus(failed);
    return failed;
  } finally {
    window.clearTimeout(timeout);
  }
};

/**
 * Starts a shadow exchange once per page load. Returned access and refresh
 * tokens deliberately stay ephemeral: product requests still use Supabase.
 */
export const startPlatformAuthCanary = () => {
  if (!exchangePromise) exchangePromise = exchangePlatformProof();

  return exchangePromise;
};
