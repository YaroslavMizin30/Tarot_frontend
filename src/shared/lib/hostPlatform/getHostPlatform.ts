import { telegramHostPlatform } from './telegramHostPlatform';
import type { HostPlatform } from './types';
import { webHostPlatform } from './webHostPlatform';

export const getHostPlatform = (): HostPlatform =>
  window.Telegram?.WebApp?.initData
    ? telegramHostPlatform
    : webHostPlatform;
