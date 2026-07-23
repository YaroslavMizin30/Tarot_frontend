import {
  createHostPlatformProofProvider,
  createSessionTransport,
  SessionTransportError,
  type SessionTransport,
} from '@/shared/api/session';

const STATUS_STORAGE_KEY = 'tarotopia:platform-auth-canary-status';

type PlatformAuthCanaryResult =
  | { status: 'skipped' }
  | { appUserId: string; status: 'succeeded' }
  | { code: string; status: 'failed' };

type PlatformAuthCanaryRequestResult =
  | { status: 'skipped' }
  | { data: unknown; status: 'succeeded' }
  | { code: string; status: 'failed' };

let exchangePromise: Promise<PlatformAuthCanaryResult> | null = null;
let sessionTransport: SessionTransport | null = null;

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

const getSessionTransport = () => {
  if (sessionTransport) return sessionTransport;

  const apiUrl = getApiUrl();
  if (!apiUrl) {
    throw new SessionTransportError('SESSION_API_URL_INVALID');
  }

  sessionTransport = createSessionTransport({
    allowInsecureLocalhost: import.meta.env.DEV,
    apiBaseUrl: apiUrl,
    proofProvider: createHostPlatformProofProvider(
      'telegram-mini-app-canary',
    ),
  });
  return sessionTransport;
};

const getSafeErrorCode = (error: unknown) =>
  error instanceof SessionTransportError
    ? error.code
    : 'PLATFORM_AUTH_CANARY_UNEXPECTED_ERROR';

const exchangePlatformProof = async (): Promise<PlatformAuthCanaryResult> => {
  if (import.meta.env.VITE_PLATFORM_AUTH_CANARY_ENABLED !== 'true') {
    return { status: 'skipped' };
  }

  try {
    const session = await getSessionTransport().establishSession();
    const succeeded = {
      appUserId: session.appUserId,
      status: 'succeeded' as const,
    };
    saveStatus(succeeded);
    return succeeded;
  } catch (error) {
    const failed = {
      code: getSafeErrorCode(error),
      status: 'failed' as const,
    };
    saveStatus(failed);
    return failed;
  }
};

/**
 * Starts a shadow exchange once per page load. The returned session remains
 * only in the replaceable memory store: product requests still use Supabase.
 */
export const startPlatformAuthCanary = () => {
  if (!exchangePromise) exchangePromise = exchangePlatformProof();

  return exchangePromise;
};

/**
 * Executes an allowlisted shadow read with the session transport. Product
 * requests and persisted authentication remain on the established backend
 * until an explicit cutover.
 */
export const requestPlatformAuthCanary = async (
  path: '/v1/profile',
): Promise<PlatformAuthCanaryRequestResult> => {
  const exchange = await startPlatformAuthCanary();

  if (exchange.status !== 'succeeded') return exchange;

  try {
    return {
      data: await getSessionTransport().requestJson(path),
      status: 'succeeded',
    };
  } catch (error) {
    return {
      code: getSafeErrorCode(error),
      status: 'failed',
    };
  }
};
