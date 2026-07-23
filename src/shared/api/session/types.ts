export type SessionPlatform = 'telegram' | 'vk' | 'max';

export interface PlatformProof {
  clientLabel?: string;
  platform: SessionPlatform;
  proof: string;
}

export interface PlatformProofProvider {
  read(): PlatformProof | null;
}

export interface ApplicationSession {
  accessToken: string;
  accessTokenExpiresAt: number;
  appUserId: string;
  refreshToken: string;
  refreshTokenExpiresAt: number;
  sessionId: string;
}

export interface SessionStore {
  clear(): Promise<void>;
  read(): Promise<ApplicationSession | null>;
  write(session: ApplicationSession): Promise<void>;
}

export type FetchLike = typeof fetch;
export type SessionRequestInit =
  NonNullable<Parameters<FetchLike>[1]>;

export interface SessionTransport {
  clear(): Promise<void>;
  establishSession(): Promise<ApplicationSession>;
  logout(options?: { all?: boolean }): Promise<void>;
  request(path: string, init?: SessionRequestInit): Promise<Response>;
  requestJson<T>(path: string, init?: SessionRequestInit): Promise<T>;
}
