import {
  createHostPlatformProofProvider,
  createSessionTransport,
  SessionTransportError,
  type SessionTransport,
} from '@/shared/api/session';

let sessionTransport: SessionTransport | null = null;

export const getPlatformApiUrl = () => {
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

export const getPlatformSessionTransport = () => {
  if (sessionTransport) return sessionTransport;

  const apiUrl = getPlatformApiUrl();
  if (!apiUrl) {
    throw new SessionTransportError('SESSION_API_URL_INVALID');
  }

  sessionTransport = createSessionTransport({
    allowInsecureLocalhost: import.meta.env.DEV,
    apiBaseUrl: apiUrl,
    proofProvider: createHostPlatformProofProvider(
      'telegram-mini-app',
    ),
  });

  return sessionTransport;
};

export const getSafePlatformApiErrorCode = (error: unknown) =>
  error instanceof SessionTransportError
    ? error.code
    : 'PLATFORM_API_UNEXPECTED_ERROR';

export const resetPlatformSessionTransportForTests = () => {
  sessionTransport = null;
};
