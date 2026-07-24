import {
  getPlatformBackendConfig,
  getPlatformSessionTransport,
  getSafePlatformApiErrorCode,
} from '@/shared/api/platformBackend';

const STATUS_STORAGE_KEY = 'tarotopia:platform-auth-canary-status';

type PlatformAuthCanaryResult =
  | { status: 'skipped' }
  | { appUserId: string; status: 'succeeded' }
  | { code: string; status: 'failed' };

type PlatformAuthCanaryRequestResult =
  | { status: 'skipped' }
  | { data: unknown; status: 'succeeded' }
  | { code: string; status: 'failed' };

interface CompleteOnboardingCanaryPayload {
  birthDate: string;
  birthPlace?: string;
  birthTime?: string | null;
  userName: string;
}

type PlatformAuthCanaryRequest =
  | { kind: 'profile.read' }
  | {
    kind: 'profile.completeOnboarding';
    payload: CompleteOnboardingCanaryPayload;
  };

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

const exchangePlatformProof = async (): Promise<PlatformAuthCanaryResult> => {
  const mode = getPlatformBackendConfig().mode;
  if (
    mode !== 'shadow' &&
    import.meta.env.VITE_PLATFORM_AUTH_CANARY_ENABLED !== 'true'
  ) {
    return { status: 'skipped' };
  }

  try {
    const session = await getPlatformSessionTransport().establishSession();
    const succeeded = {
      appUserId: session.appUserId,
      status: 'succeeded' as const,
    };
    saveStatus(succeeded);
    return succeeded;
  } catch (error) {
    const failed = {
      code: getSafePlatformApiErrorCode(error),
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
  request: PlatformAuthCanaryRequest,
): Promise<PlatformAuthCanaryRequestResult> => {
  const exchange = await startPlatformAuthCanary();

  if (exchange.status !== 'succeeded') return exchange;

  try {
    const init = request.kind === 'profile.completeOnboarding'
      ? {
        body: JSON.stringify(request.payload),
        headers: { 'content-type': 'application/json' },
        method: 'PUT',
      }
      : undefined;

    return {
      data: await getPlatformSessionTransport().requestJson(
        '/v1/profile',
        init,
      ),
      status: 'succeeded',
    };
  } catch (error) {
    return {
      code: getSafePlatformApiErrorCode(error),
      status: 'failed',
    };
  }
};

export type {
  CompleteOnboardingCanaryPayload,
  PlatformAuthCanaryRequest,
  PlatformAuthCanaryRequestResult,
};
