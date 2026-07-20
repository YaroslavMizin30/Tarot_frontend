export type HostPlatformKind = 'telegram' | 'web';

export interface HostPlatformUser {
  provider: HostPlatformKind;
  externalUserId: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
}

export interface HostChromeColors {
  header: string;
  bottomBar: string;
}

export interface HostPlatform {
  kind: HostPlatformKind;
  isEmbedded: boolean;
  getAuthPayload(): string | null;
  getUser(): HostPlatformUser | null;
  getStableViewportHeight(): number;
  setChromeColors(colors: HostChromeColors): void;
  subscribeViewportChanged(listener: () => void): () => void;
}
