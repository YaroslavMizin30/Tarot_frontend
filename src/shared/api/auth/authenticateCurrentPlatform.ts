import { getHostPlatform } from '@/shared/lib/hostPlatform';
import type { AuthenticatedIdentity } from '@/shared/types/identity';

import { authenticateWithTelegram } from '../supabase/authenticateWithTelegram';
import { startPlatformAuthCanary } from './platformAuthCanary';

/**
 * Authenticates the current host without exposing its SDK to application code.
 * Telegram remains the only production adapter until another backend verifier
 * is implemented.
 */
export const authenticateCurrentPlatform = async (): Promise<AuthenticatedIdentity> => {
  const hostPlatform = getHostPlatform();

  if (hostPlatform.kind === 'telegram' || import.meta.env.DEV) {
    const canaryExchange = startPlatformAuthCanary();
    const identity = await authenticateWithTelegram();
    const canaryResult = await canaryExchange;

    if (
      canaryResult.status === 'succeeded' &&
      canaryResult.appUserId.toLowerCase() !== identity.appUserId.toLowerCase()
    ) {
      throw new Error('PLATFORM_AUTH_CANARY_IDENTITY_MISMATCH');
    }

    return identity;
  }

  throw new Error('HOST_PLATFORM_AUTH_NOT_IMPLEMENTED');
};
