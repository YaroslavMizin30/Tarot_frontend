import { afterEach, describe, expect, it, vi } from 'vitest';

const requestPlatformAuthCanary = vi.hoisted(() => vi.fn());

vi.mock('@/shared/api/auth/platformAuthCanary', () => ({
  requestPlatformAuthCanary,
}));

import {
  compareOnboardingCanary,
  type ComparableProfile,
} from '../src/entities/User/api/compareProfileCanary/compareProfileCanary';

const current: ComparableProfile = {
  appUserId: '11111111-1111-4111-8111-111111111111',
  audio: true,
  birthDate: '30.04.1994',
  birthPlace: 'Москва',
  birthTime: undefined,
  theme: 'standard',
  userName: 'Ярослав',
};

const canonicalProfile = {
  appUserId: current.appUserId,
  audio: current.audio,
  birthDate: '1994-04-30',
  birthPlace: current.birthPlace,
  birthTime: null,
  createdAt: '2026-07-23T10:00:00.000Z',
  tarotProfile: {},
  theme: current.theme,
  updatedAt: '2026-07-23T10:00:00.000Z',
  userName: current.userName,
};

const succeeded = (profile = canonicalProfile) => ({
  data: {
    onboardingRequired: false,
    profile,
  },
  status: 'succeeded' as const,
});

const onboardingInput = {
  birthDate: '30.04.1994',
  birthPlace: ' Москва ',
  birthTime: '',
  userName: ' Ярослав ',
};

const setItem = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('onboarding profile shadow canary', () => {
  it('does not issue requests while the dedicated flag is disabled', async () => {
    vi.stubEnv('VITE_ONBOARDING_SHADOW_CANARY_ENABLED', 'false');

    await compareOnboardingCanary(current, onboardingInput);

    expect(requestPlatformAuthCanary).not.toHaveBeenCalled();
  });

  it('compares concurrent create-once retries and the following read', async () => {
    vi.stubEnv('VITE_ONBOARDING_SHADOW_CANARY_ENABLED', 'true');
    vi.stubGlobal('window', { sessionStorage: { setItem } });
    requestPlatformAuthCanary.mockResolvedValue(succeeded());

    await compareOnboardingCanary(current, onboardingInput);

    expect(requestPlatformAuthCanary).toHaveBeenCalledTimes(3);
    expect(requestPlatformAuthCanary).toHaveBeenNthCalledWith(1, {
      kind: 'profile.completeOnboarding',
      payload: {
        birthDate: '1994-04-30',
        birthPlace: 'Москва',
        birthTime: null,
        userName: 'Ярослав',
      },
    });
    expect(requestPlatformAuthCanary).toHaveBeenNthCalledWith(2, {
      kind: 'profile.completeOnboarding',
      payload: {
        birthDate: '1994-04-30',
        birthPlace: 'Москва',
        birthTime: null,
        userName: 'Ярослав',
      },
    });
    expect(requestPlatformAuthCanary).toHaveBeenNthCalledWith(3, {
      kind: 'profile.read',
    });

    const [, serialized] = setItem.mock.calls[0] as [string, string];
    expect(JSON.parse(serialized)).toMatchObject({ status: 'succeeded' });
  });

  it('stores only mismatched field names in safe diagnostics', async () => {
    vi.stubEnv('VITE_ONBOARDING_SHADOW_CANARY_ENABLED', 'true');
    vi.stubGlobal('window', { sessionStorage: { setItem } });
    requestPlatformAuthCanary.mockResolvedValue(succeeded({
      ...canonicalProfile,
      userName: 'Другое имя',
    }));

    await compareOnboardingCanary(current, onboardingInput);

    const [storageKey, serialized] = setItem.mock.calls[0] as [string, string];
    const diagnostic = JSON.parse(serialized);

    expect(storageKey).toBe('tarotopia:onboarding-shadow-canary-status');
    expect(diagnostic).toMatchObject({
      code: 'ONBOARDING_SHADOW_DATA_MISMATCH',
      fields: ['userName'],
      status: 'failed',
    });
    expect(serialized).not.toContain('Другое имя');
    expect(serialized).not.toContain('Ярослав');
  });

  it('keeps a canary transport failure out of the product flow', async () => {
    vi.stubEnv('VITE_ONBOARDING_SHADOW_CANARY_ENABLED', 'true');
    vi.stubGlobal('window', { sessionStorage: { setItem } });
    requestPlatformAuthCanary.mockResolvedValue({
      code: 'SESSION_NETWORK_ERROR',
      status: 'failed',
    });

    await expect(compareOnboardingCanary(current, onboardingInput))
      .resolves.toBeUndefined();

    const [, serialized] = setItem.mock.calls[0] as [string, string];
    expect(JSON.parse(serialized)).toMatchObject({
      code: 'SESSION_NETWORK_ERROR',
      status: 'failed',
    });
  });
});
