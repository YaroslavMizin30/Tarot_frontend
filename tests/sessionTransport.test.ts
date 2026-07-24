import { describe, expect, it, vi } from 'vitest';

import { createMemorySessionStore } from '../src/shared/api/session/memorySessionStore';
import {
  createSessionTransport,
  SessionTransportError,
} from '../src/shared/api/session/sessionTransport';
import type {
  ApplicationSession,
  FetchLike,
  PlatformProofProvider,
} from '../src/shared/api/session/types';

const NOW = Date.parse('2026-07-23T08:00:00.000Z');
const APP_USER_ID = '11111111-1111-4111-8111-111111111111';
const SESSION_ID = '22222222-2222-4222-8222-222222222222';

const proofProvider: PlatformProofProvider = {
  read: () => ({
    clientLabel: 'test-client',
    platform: 'telegram',
    proof: 'signed-platform-proof',
  }),
};

const createStoredSession = (
  overrides: Partial<ApplicationSession> = {},
): ApplicationSession => ({
  accessToken: 'old-access-token',
  accessTokenExpiresAt: NOW + 15 * 60_000,
  appUserId: APP_USER_ID,
  refreshToken: 'old-refresh-token',
  refreshTokenExpiresAt: NOW + 30 * 24 * 60 * 60_000,
  sessionId: SESSION_ID,
  ...overrides,
});

const createTokenPayload = (
  overrides: Record<string, unknown> = {},
) => ({
  accessToken: 'new-access-token',
  accessTokenExpiresAt: '2026-07-23T08:15:00.000Z',
  expiresIn: 900,
  refreshToken: 'new-refresh-token',
  refreshTokenExpiresAt: '2026-08-22T08:00:00.000Z',
  sessionId: SESSION_ID,
  tokenType: 'Bearer',
  ...overrides,
});

const createExchangePayload = (
  overrides: Record<string, unknown> = {},
) => ({
  ...createTokenPayload(),
  appUserId: APP_USER_ID,
  onboardingRequired: false,
  platform: 'telegram',
  profileCandidate: {
    displayName: 'Test User',
    firstName: 'Test',
  },
  ...overrides,
});

const jsonResponse = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), {
    headers: { 'content-type': 'application/json' },
    status,
  });

const createTransport = (
  fetcher: FetchLike,
  initialSession: ApplicationSession | null = null,
) => createSessionTransport({
  apiBaseUrl: 'https://api.example.test',
  fetcher,
  now: () => NOW,
  proofProvider,
  store: createMemorySessionStore(initialSession),
});

const requestUrl = (input: Parameters<FetchLike>[0]) =>
  input instanceof URL ? input.toString() : String(input);

describe('session transport', () => {
  it('deduplicates concurrent platform exchanges', async () => {
    const fetcher = vi.fn<FetchLike>(() =>
      Promise.resolve(jsonResponse(createExchangePayload())));
    const transport = createTransport(fetcher);

    const [first, second] = await Promise.all([
      transport.establishSession(),
      transport.establishSession(),
    ]);

    expect(first.appUserId).toBe(APP_USER_ID);
    expect(second).toEqual(first);
    expect(fetcher).toHaveBeenCalledOnce();
    expect(requestUrl(fetcher.mock.calls[0][0]))
      .toBe('https://api.example.test/v1/auth/platform/exchange');
  });

  it('deduplicates refresh rotation and preserves the canonical user', async () => {
    const fetcher = vi.fn<FetchLike>(() =>
      Promise.resolve(jsonResponse(createTokenPayload())));
    const transport = createTransport(fetcher, createStoredSession({
      accessTokenExpiresAt: NOW - 1,
    }));

    const [first, second] = await Promise.all([
      transport.establishSession(),
      transport.establishSession(),
    ]);

    expect(first.appUserId).toBe(APP_USER_ID);
    expect(first.accessToken).toBe('new-access-token');
    expect(second).toEqual(first);
    expect(fetcher).toHaveBeenCalledOnce();
    expect(requestUrl(fetcher.mock.calls[0][0]))
      .toBe('https://api.example.test/v1/auth/refresh');
  });

  it('rotates once and retries a protected request after 401', async () => {
    let profileRequests = 0;
    const fetcher = vi.fn<FetchLike>((input, init) => {
      const url = requestUrl(input);

      if (url.endsWith('/v1/auth/refresh')) {
        return Promise.resolve(jsonResponse(createTokenPayload()));
      }

      if (url.endsWith('/v1/profile')) {
        profileRequests += 1;
        const headers = new Headers(init?.headers);
        const expected = profileRequests === 1
          ? 'Bearer old-access-token'
          : 'Bearer new-access-token';
        expect(headers.get('authorization')).toBe(expected);

        return Promise.resolve(profileRequests === 1
          ? jsonResponse({ error: { code: 'AUTH_INVALID' } }, 401)
          : jsonResponse({ onboardingRequired: false, profile: {} }));
      }

      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });
    const transport = createTransport(fetcher, createStoredSession());

    const result = await transport.requestJson<{ onboardingRequired: boolean }>(
      '/v1/profile',
    );

    expect(result.onboardingRequired).toBe(false);
    expect(profileRequests).toBe(2);
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it('deduplicates refresh after concurrent protected requests receive 401', async () => {
    let refreshRequests = 0;
    const attempts = new Map<string, number>();
    const fetcher = vi.fn<FetchLike>((input, init) => {
      const url = requestUrl(input);

      if (url.endsWith('/v1/auth/refresh')) {
        refreshRequests += 1;
        return Promise.resolve(jsonResponse(createTokenPayload()));
      }

      const requestName = url.endsWith('/v1/profile') ? 'profile' : 'sessions';
      const count = (attempts.get(requestName) ?? 0) + 1;
      attempts.set(requestName, count);
      const token = new Headers(init?.headers).get('authorization');

      return Promise.resolve(count === 1
        ? jsonResponse({ error: { code: 'AUTH_INVALID' } }, 401)
        : jsonResponse({ requestName, token }));
    });
    const transport = createTransport(fetcher, createStoredSession());

    const [profile, sessions] = await Promise.all([
      transport.requestJson<{ token: string }>('/v1/profile'),
      transport.requestJson<{ token: string }>('/v1/auth/sessions'),
    ]);

    expect(refreshRequests).toBe(1);
    expect(profile.token).toBe('Bearer new-access-token');
    expect(sessions.token).toBe('Bearer new-access-token');
    expect(attempts).toEqual(new Map([
      ['profile', 2],
      ['sessions', 2],
    ]));
  });

  it('falls back to a fresh exchange after a rejected refresh token', async () => {
    const fetcher = vi.fn<FetchLike>((input) => {
      const url = requestUrl(input);
      if (url.endsWith('/v1/auth/refresh')) {
        return Promise.resolve(jsonResponse({
          error: { code: 'AUTH_REFRESH_TOKEN_REUSED' },
        }, 401));
      }
      if (url.endsWith('/v1/auth/platform/exchange')) {
        return Promise.resolve(jsonResponse(createExchangePayload({
          accessToken: 'exchange-access-token',
        })));
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });
    const transport = createTransport(fetcher, createStoredSession({
      accessTokenExpiresAt: NOW - 1,
    }));

    const session = await transport.establishSession();

    expect(session.accessToken).toBe('exchange-access-token');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('does not blindly replay platform proof after a transient refresh failure', async () => {
    const fetcher = vi.fn<FetchLike>(() =>
      Promise.resolve(
        jsonResponse({ error: { code: 'SERVICE_UNAVAILABLE' } }, 503),
      ));
    const transport = createTransport(fetcher, createStoredSession({
      accessTokenExpiresAt: NOW - 1,
    }));

    await expect(transport.establishSession()).rejects.toMatchObject({
      code: 'SERVICE_UNAVAILABLE',
      status: 503,
    });
    expect(fetcher).toHaveBeenCalledOnce();
  });

  it('blocks absolute request URLs before a bearer token can leak', async () => {
    const fetcher = vi.fn<FetchLike>();
    const transport = createTransport(fetcher, createStoredSession());

    await expect(transport.request('https://attacker.invalid/v1/profile'))
      .rejects.toMatchObject({
        code: 'SESSION_REQUEST_PATH_INVALID',
      });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('allows encoded query parameters without allowing an external origin', async () => {
    const fetcher = vi.fn<FetchLike>((input) => {
      expect(requestUrl(input)).toBe(
        'https://api.example.test/v1/spreads?since=2026-07-01',
      );
      return Promise.resolve(jsonResponse({ spreads: [] }));
    });
    const transport = createTransport(fetcher, createStoredSession());

    await expect(
      transport.requestJson('/v1/spreads?since=2026-07-01'),
    ).resolves.toEqual({ spreads: [] });
    await expect(
      transport.request('/v1/profile#https://attacker.invalid'),
    ).rejects.toMatchObject({ code: 'SESSION_REQUEST_PATH_INVALID' });
  });

  it('clears the local session even when remote logout fails', async () => {
    const store = createMemorySessionStore(createStoredSession());
    const fetcher = vi.fn<FetchLike>(() =>
      Promise.resolve(
        jsonResponse({ error: { code: 'SERVICE_UNAVAILABLE' } }, 503),
      ));
    const transport = createSessionTransport({
      apiBaseUrl: 'https://api.example.test',
      fetcher,
      now: () => NOW,
      proofProvider,
      store,
    });

    await expect(transport.logout()).rejects.toBeInstanceOf(
      SessionTransportError,
    );
    await expect(store.read()).resolves.toBeNull();
  });
});
