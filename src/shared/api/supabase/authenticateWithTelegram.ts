import { ensureSupabase } from './ensureSupabase';
import { getHostPlatform } from '@/shared/lib/hostPlatform';
import type { AuthenticatedTelegramIdentity } from '@/shared/types/identity';

export type { AuthenticatedTelegramIdentity } from '@/shared/types/identity';

interface TelegramAuthResponse {
  tokenHash: string;
  appUserId: string;
  telegramId: number;
}

let authenticationPromise: Promise<AuthenticatedTelegramIdentity> | null = null;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const createAuthenticatedIdentity = (
  authUserId: string,
  appUserId: string,
  telegramId: number,
): AuthenticatedTelegramIdentity => ({
  appUserId,
  authUserId,
  provider: 'telegram',
  externalUserId: String(telegramId),
  telegramId,
});

const appUserIdFromMetadata = (metadata: Record<string, unknown>) => {
  const appUserId = metadata.app_user_id;

  return typeof appUserId === 'string' && UUID_PATTERN.test(appUserId)
    ? appUserId
    : null;
};

const telegramIdFromMetadata = (metadata: Record<string, unknown>) => {
  const telegramId = Number(metadata.telegram_id);

  return Number.isSafeInteger(telegramId) && telegramId > 0
    ? telegramId
    : null;
};

const getExpectedTelegramId = () => {
  if (import.meta.env.DEV) return null;

  const hostUser = getHostPlatform().getUser();
  const telegramId = Number(
    hostUser?.provider === 'telegram'
      ? hostUser.externalUserId
      : null,
  );

  if (!Number.isSafeInteger(telegramId) || telegramId <= 0) {
    throw new Error('TELEGRAM_USER_REQUIRED');
  }

  return telegramId;
};

const clearLocalSession = async () => {
  try {
    await window.supabase.auth.signOut({ scope: 'local' });
  } catch {
    // A stale local session must not block a fresh Telegram login.
  }
};

const resolveAppUserId = async (metadata: Record<string, unknown>) => {
  const metadataAppUserId = appUserIdFromMetadata(metadata);
  if (metadataAppUserId) return metadataAppUserId;

  const { data, error } = await window.supabase.rpc('current_app_user_id');
  return !error && typeof data === 'string' && UUID_PATTERN.test(data)
    ? data
    : null;
};

const getReusableSession = async (
  expectedTelegramId: number | null,
): Promise<AuthenticatedTelegramIdentity | null> => {
  const { data: sessionData } = await window.supabase.auth.getSession();
  if (!sessionData.session) return null;

  const { data, error } = await window.supabase.auth.getUser();
  const telegramId = data.user
    ? telegramIdFromMetadata(data.user.app_metadata)
    : null;
  const appUserId = data.user
    ? await resolveAppUserId(data.user.app_metadata)
    : null;

  if (
    error ||
    !data.user ||
    appUserId === null ||
    telegramId === null ||
    (expectedTelegramId !== null && telegramId !== expectedTelegramId)
  ) {
    await clearLocalSession();
    return null;
  }

  return createAuthenticatedIdentity(data.user.id, appUserId, telegramId);
};

const authenticateInDevelopment = async (): Promise<AuthenticatedTelegramIdentity> => {
  const email = import.meta.env.VITE_DEV_AUTH_EMAIL;
  const password = import.meta.env.VITE_DEV_AUTH_PASSWORD;

  if (!email || !password) {
    throw new Error('DEV_AUTH_CREDENTIALS_REQUIRED');
  }

  const { data, error } = await window.supabase.auth.signInWithPassword({
    email,
    password,
  });

  const telegramId = data.user
    ? telegramIdFromMetadata(data.user.app_metadata)
    : null;
  const appUserId = data.user
    ? await resolveAppUserId(data.user.app_metadata)
    : null;
  if (
    error ||
    !data.user ||
    appUserId === null ||
    telegramId === null
  ) {
    throw error ?? new Error('DEV_TELEGRAM_IDENTITY_REQUIRED');
  }

  return createAuthenticatedIdentity(data.user.id, appUserId, telegramId);
};

const authenticateInTelegram = async (): Promise<AuthenticatedTelegramIdentity> => {
  const initData = getHostPlatform().getAuthPayload();
  if (!initData) {
    throw new Error('TELEGRAM_INIT_DATA_REQUIRED');
  }

  const { data, error } =
    await window.supabase.functions.invoke<TelegramAuthResponse>(
      'telegram-auth',
      { body: { initData } },
    );

  if (
    error ||
    !data?.tokenHash ||
    typeof data.appUserId !== 'string' ||
    !UUID_PATTERN.test(data.appUserId) ||
    !Number.isSafeInteger(data.telegramId) ||
    data.telegramId <= 0
  ) {
    throw error ?? new Error('TELEGRAM_AUTH_FAILED');
  }

  const { data: verification, error: verificationError } =
    await window.supabase.auth.verifyOtp({
      token_hash: data.tokenHash,
      type: 'email',
    });

  const verifiedTelegramId = verification.user
    ? telegramIdFromMetadata(verification.user.app_metadata)
    : null;
  const verifiedAppUserId = verification.user
    ? await resolveAppUserId(verification.user.app_metadata)
    : null;
  if (
    verificationError ||
    !verification.user ||
    verifiedAppUserId === null ||
    verifiedAppUserId !== data.appUserId ||
    verifiedTelegramId === null ||
    verifiedTelegramId !== data.telegramId
  ) {
    throw verificationError ?? new Error('TELEGRAM_SESSION_MISMATCH');
  }

  return createAuthenticatedIdentity(
    verification.user.id,
    verifiedAppUserId,
    verifiedTelegramId,
  );
};

const authenticate = async (): Promise<AuthenticatedTelegramIdentity> => {
  await ensureSupabase();

  const expectedTelegramId = getExpectedTelegramId();
  const reusableSession = await getReusableSession(expectedTelegramId);
  if (reusableSession) return reusableSession;

  return import.meta.env.DEV
    ? authenticateInDevelopment()
    : authenticateInTelegram();
};

/**
 * Establishes one verified Supabase session per application load.
 * Rejected attempts are not cached, so a transient failure can be retried.
 */
export const authenticateWithTelegram = () => {
  if (!authenticationPromise) {
    authenticationPromise = authenticate().catch((error) => {
      authenticationPromise = null;
      throw error;
    });
  }

  return authenticationPromise;
};
