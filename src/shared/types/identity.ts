export type IdentityProvider = 'telegram' | 'vk' | 'max' | 'web';

export interface ExternalIdentity {
  provider: IdentityProvider;
  externalUserId: string;
}

export interface AuthenticatedIdentity extends ExternalIdentity {
  appUserId: string;
  authUserId: string;
}

/**
 * Compatibility shape while the users table is still keyed by Telegram ID.
 * Remove telegramId after user_identities becomes the source of truth.
 */
export interface AuthenticatedTelegramIdentity
  extends AuthenticatedIdentity {
  provider: 'telegram';
  telegramId: number;
}
