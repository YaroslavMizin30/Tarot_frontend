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

  const telegramId = Number(data.user?.app_metadata?.telegram_id);
  if (
    error ||
    !data.user ||
    !Number.isSafeInteger(telegramId) ||
    telegramId <= 0
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

  const verifiedTelegramId = Number(
    verification.user?.app_metadata?.telegram_id,
  );
  if (
    verificationError ||
    !verification.user ||
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
