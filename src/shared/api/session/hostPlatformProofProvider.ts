import { getHostPlatform } from '@/shared/lib/hostPlatform';

import type { PlatformProofProvider } from './types';

export const createHostPlatformProofProvider = (
  clientLabel = 'tarotopia-mini-app',
): PlatformProofProvider => ({
  read: () => {
    const hostPlatform = getHostPlatform();
    const proof = hostPlatform.getAuthPayload();

    if (hostPlatform.kind !== 'telegram' || !proof) return null;

    return {
      clientLabel,
      platform: 'telegram',
      proof,
    };
  },
});
