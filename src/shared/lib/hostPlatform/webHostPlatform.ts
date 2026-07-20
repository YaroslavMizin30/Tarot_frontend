import type { HostPlatform, HostPlatformUser } from './types';

const getDevelopmentUser = (): HostPlatformUser | null => {
  if (!import.meta.env.DEV) return null;

  const legacyUserId = Number(import.meta.env.VITE_ADMIN_ID);
  if (!Number.isSafeInteger(legacyUserId) || legacyUserId <= 0) {
    return null;
  }

  return {
    provider: 'web',
    externalUserId: String(legacyUserId),
  };
};

export const webHostPlatform: HostPlatform = {
  kind: 'web',
  isEmbedded: false,
  getAuthPayload: () => null,
  getUser: getDevelopmentUser,
  getStableViewportHeight: () => window.innerHeight,
  setChromeColors: () => undefined,
  subscribeViewportChanged: () => () => undefined,
};
