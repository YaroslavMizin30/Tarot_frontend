import { describe, expect, it } from 'vitest';

import {
  parseCanonicalProfileResponse,
} from '../src/shared/api/platformBackend/profileContract';

const profile = {
  appUserId: '11111111-1111-4111-8111-111111111111',
  audio: true,
  birthDate: '1994-04-30',
  birthPlace: 'Москва',
  birthTime: '12:34:56',
  createdAt: '2026-07-23T10:00:00.000Z',
  tarotProfile: { version: 1 },
  theme: 'standard',
  updatedAt: '2026-07-23T10:00:00.000Z',
  userName: 'Ярослав',
};

describe('canonical profile contract', () => {
  it('parses a completed profile and normalizes time precision', () => {
    expect(parseCanonicalProfileResponse({
      onboardingRequired: false,
      profile,
    })).toEqual({
      onboardingRequired: false,
      profile: {
        ...profile,
        birthTime: '12:34',
      },
    });
  });

  it('parses the onboarding-required state without inventing a profile', () => {
    expect(parseCanonicalProfileResponse({
      onboardingRequired: true,
      profile: null,
    })).toEqual({
      onboardingRequired: true,
      profile: null,
    });
  });

  it.each([
    {
      onboardingRequired: true,
      profile,
    },
    {
      onboardingRequired: false,
      profile: null,
    },
    {
      onboardingRequired: false,
      profile: { ...profile, appUserId: 'telegram-id' },
    },
    {
      onboardingRequired: false,
      profile: { ...profile, birthDate: '30.04.1994' },
    },
    {
      onboardingRequired: false,
      profile: { ...profile, theme: 'unknown' },
    },
  ])('rejects an invalid response %#', (response) => {
    expect(parseCanonicalProfileResponse(response)).toBeNull();
  });
});
