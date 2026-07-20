import { ensureSupabase } from './ensureSupabase';

interface TelegramAuthResponse {
  tokenHash: string;
  telegramId: number;
}

export interface AuthenticatedTelegramIdentity {
  authUserId: string;
  telegramId: number;
}

let authenticationPromise: Promise<AuthenticatedTelegramIdentity> | null = null;

const telegramIdFromMetadata = (metadata: Record<string, unknown>) => {
  const telegramId = Number(metadata.telegram_id);

  return Number.isSafeInteger(telegramId) && telegramId > 0
    ? telegramId
    : null;
};

const getExpectedTelegramId = () => {
  if (import.meta.env.DEV) return null;

  const telegramId = Number(
    window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
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

const getReusableSession = async (
  expectedTelegramId: number | null,
): Promise<AuthenticatedTelegramIdentity | null> => {
  const { data: sessionData } = await window.supabase.auth.getSession();
  if (!sessionData.session) return null;

  const { data, error } = await window.supabase.auth.getUser();
  const telegramId = data.user
    ? telegramIdFromMetadata(data.user.app_metadata)
    : null;

  if (
    error ||
    !data.user ||
    telegramId === null ||
    (expectedTelegramId !== null && telegramId !== expectedTelegramId)
  ) {
    await clearLocalSession();
    return null;
  }

  return { authUserId: data.user.id, telegramId };
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
  if (
    error ||
    !data.user ||
    telegramId === null
  ) {
    throw error ?? new Error('DEV_TELEGRAM_IDENTITY_REQUIRED');
  }

  return { authUserId: data.user.id, telegramId };
};

const authenticateInTelegram = async (): Promise<AuthenticatedTelegramIdentity> => {
  const initData = window.Telegram?.WebApp?.initData;
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
  if (
    verificationError ||
    !verification.user ||
    verifiedTelegramId === null ||
    verifiedTelegramId !== data.telegramId
  ) {
    throw verificationError ?? new Error('TELEGRAM_SESSION_MISMATCH');
  }

  return {
    authUserId: verification.user.id,
    telegramId: verifiedTelegramId,
  };
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
