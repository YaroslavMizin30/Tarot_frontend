import { getHostPlatform } from '@/shared/lib/hostPlatform';
import type { AuthenticatedIdentity } from '@/shared/types/identity';

import { authenticateWithTelegram } from '../supabase/authenticateWithTelegram';

/**
 * Authenticates the current host without exposing its SDK to application code.
 * Telegram remains the only production adapter until another backend verifier
 * is implemented.
 */
export const authenticateCurrentPlatform = (): Promise<AuthenticatedIdentity> => {
  const hostPlatform = getHostPlatform();

  if (hostPlatform.kind === 'telegram' || import.meta.env.DEV) {
    return authenticateWithTelegram();
  }

  throw new Error('HOST_PLATFORM_AUTH_NOT_IMPLEMENTED');
};
