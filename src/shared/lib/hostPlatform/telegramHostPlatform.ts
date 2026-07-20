import type { HostPlatform, HostPlatformUser } from './types';

const getWebApp = () => window.Telegram?.WebApp;

const normalizeUser = (): HostPlatformUser | null => {
  const user = getWebApp()?.initDataUnsafe.user;
  if (!user || !Number.isSafeInteger(user.id) || user.id <= 0) {
    return null;
  }

  return {
    provider: 'telegram',
    externalUserId: String(user.id),
    firstName: user.first_name?.trim() || undefined,
    lastName: user.last_name?.trim() || undefined,
    username: user.username?.trim() || undefined,
    languageCode: user.language_code?.trim() || undefined,
  };
};

export const telegramHostPlatform: HostPlatform = {
  kind: 'telegram',
  isEmbedded: true,
  getAuthPayload: () => getWebApp()?.initData || null,
  getUser: normalizeUser,
  getStableViewportHeight: () =>
    getWebApp()?.viewportStableHeight || window.innerHeight,
  setChromeColors: ({ header, bottomBar }) => {
    const webApp = getWebApp();
    if (!webApp) return;

    try {
      webApp.setHeaderColor(header);
      webApp.setBottomBarColor(bottomBar);
    } catch {
      // Older host versions may not support one of the chrome methods.
    }
  },
  subscribeViewportChanged: (listener) => {
    const webApp = getWebApp();
    if (!webApp) return () => undefined;

    webApp.onEvent('viewportChanged', listener);
    return () => webApp.offEvent('viewportChanged', listener);
  },
};
