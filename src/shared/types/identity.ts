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
 * Telegram adapter compatibility shape. Product data is owned by appUserId;
 * telegramId is used only by the host adapter and can be removed after all
 * Telegram-specific UI flows move behind HostPlatform.
 */
export interface AuthenticatedTelegramIdentity
  extends AuthenticatedIdentity {
  provider: 'telegram';
  telegramId: number;
}
