import {
  requestPlatformAuthCanary,
  type CompleteOnboardingCanaryPayload,
  type PlatformAuthCanaryRequestResult,
} from '@/shared/api/auth/platformAuthCanary';
import {
  parseCanonicalProfileResponse,
  type CanonicalProfile,
} from '@/shared/api/platformBackend';

import type { User } from '../../types/user';

const READ_STATUS_STORAGE_KEY = 'tarotopia:profile-shadow-canary-status';
const ONBOARDING_STATUS_STORAGE_KEY =
  'tarotopia:onboarding-shadow-canary-status';

type JsonObject = Record<string, unknown>;

type ComparableProfile = Pick<
  User,
  | 'appUserId'
  | 'audio'
  | 'birthDate'
  | 'birthPlace'
  | 'theme'
  | 'userName'
> & {
  birthTime?: string | null;
};

interface OnboardingCanaryInput {
  birthDate: string;
  birthPlace?: string;
  birthTime?: string;
  userName: string;
}

const saveStatus = (storageKey: string, value: JsonObject) => {
  try {
    window.sessionStorage.setItem(
      storageKey,
      JSON.stringify({ ...value, at: new Date().toISOString() }),
    );
  } catch {
    // Shadow diagnostics must never affect the established profile flow.
  }
};

const isObject = (value: unknown): value is JsonObject =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const toIsoBirthDate = (value: string) => {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : value;
};

const normalizeBirthTime = (value: unknown): string | null => {
  if (typeof value !== 'string' || !value.trim()) return null;
  return value.trim().slice(0, 5);
};

const mismatchFields = (
  current: ComparableProfile,
  candidate: CanonicalProfile,
): string[] => {
  const fields: Array<[string, unknown, unknown]> = [
    [
      'appUserId',
      current.appUserId.toLowerCase(),
      candidate.appUserId.toLowerCase(),
    ],
    ['audio', current.audio, candidate.audio],
    ['birthDate', toIsoBirthDate(current.birthDate), candidate.birthDate],
    ['birthPlace', current.birthPlace || '', candidate.birthPlace],
    ['birthTime', normalizeBirthTime(current.birthTime), candidate.birthTime],
    ['theme', current.theme, candidate.theme],
    ['userName', current.userName, candidate.userName],
  ];

  return fields
    .filter(([, currentValue, candidateValue]) => currentValue !== candidateValue)
    .map(([field]) => field);
};

const parseCompletedProfile = (
  result: PlatformAuthCanaryRequestResult,
): {
  error?: string;
  profile?: CanonicalProfile;
  status: PlatformAuthCanaryRequestResult['status'];
} => {
  if (result.status !== 'succeeded') {
    return {
      ...(result.status === 'failed' ? { error: result.code } : {}),
      status: result.status,
    };
  }

  if (
    !isObject(result.data) ||
    result.data.onboardingRequired !== false
  ) {
    return {
      error: 'ONBOARDING_SHADOW_RESPONSE_INVALID',
      status: 'failed',
    };
  }

  const response = parseCanonicalProfileResponse(result.data);
  return response && !response.onboardingRequired
    ? { profile: response.profile, status: 'succeeded' }
    : {
      error: 'ONBOARDING_SHADOW_RESPONSE_INVALID',
      status: 'failed',
    };
};

const profilesMatch = (
  first: CanonicalProfile,
  second: CanonicalProfile,
) => mismatchFields(first, second).length === 0;

export const compareProfileCanary = async (current: User | null) => {
  if (import.meta.env.VITE_PROFILE_SHADOW_CANARY_ENABLED !== 'true') return;

  const result = await requestPlatformAuthCanary({ kind: 'profile.read' });

  if (result.status === 'skipped') return;
  if (result.status === 'failed') {
    saveStatus(READ_STATUS_STORAGE_KEY, {
      code: result.code,
      status: 'failed',
    });
    return;
  }

  const response = parseCanonicalProfileResponse(result.data);
  if (!response) {
    saveStatus(READ_STATUS_STORAGE_KEY, {
      code: 'PROFILE_SHADOW_RESPONSE_INVALID',
      status: 'failed',
    });
    return;
  }

  if (!current) {
    const matches = response.onboardingRequired;
    saveStatus(READ_STATUS_STORAGE_KEY, matches
      ? { status: 'succeeded' }
      : { code: 'PROFILE_SHADOW_ONBOARDING_MISMATCH', status: 'failed' });
    return;
  }

  if (response.onboardingRequired) {
    saveStatus(READ_STATUS_STORAGE_KEY, {
      code: 'PROFILE_SHADOW_RESPONSE_INVALID',
      status: 'failed',
    });
    return;
  }

  const mismatches = mismatchFields(current, response.profile);
  saveStatus(READ_STATUS_STORAGE_KEY, mismatches.length
    ? {
      code: 'PROFILE_SHADOW_DATA_MISMATCH',
      fields: mismatches,
      status: 'failed',
    }
    : { status: 'succeeded' });
};

/**
 * Runs only after the authoritative onboarding has succeeded. It verifies the
 * new backend's create-once semantics without making it part of the user flow.
 */
export const compareOnboardingCanary = async (
  current: ComparableProfile,
  input: OnboardingCanaryInput,
) => {
  if (
    import.meta.env.VITE_ONBOARDING_SHADOW_CANARY_ENABLED !== 'true'
  ) {
    return;
  }

  const payload: CompleteOnboardingCanaryPayload = {
    birthDate: toIsoBirthDate(input.birthDate),
    birthPlace: input.birthPlace?.trim() ?? '',
    birthTime: normalizeBirthTime(input.birthTime),
    userName: input.userName.trim(),
  };
  const complete = () => requestPlatformAuthCanary({
    kind: 'profile.completeOnboarding',
    payload,
  });
  const [firstResult, retryResult] = await Promise.all([
    complete(),
    complete(),
  ]);
  const readResult = await requestPlatformAuthCanary({
    kind: 'profile.read',
  });
  const first = parseCompletedProfile(firstResult);
  const retry = parseCompletedProfile(retryResult);
  const read = parseCompletedProfile(readResult);
  const firstError = first.error ?? retry.error ?? read.error;

  if (first.status === 'skipped') return;
  if (
    first.status !== 'succeeded' ||
    retry.status !== 'succeeded' ||
    read.status !== 'succeeded' ||
    !first.profile ||
    !retry.profile ||
    !read.profile
  ) {
    saveStatus(ONBOARDING_STATUS_STORAGE_KEY, {
      code: firstError ?? 'ONBOARDING_SHADOW_REQUEST_FAILED',
      status: 'failed',
    });
    return;
  }

  const fields = mismatchFields(current, first.profile);
  const stable = profilesMatch(first.profile, retry.profile) &&
    profilesMatch(first.profile, read.profile);

  saveStatus(ONBOARDING_STATUS_STORAGE_KEY, fields.length || !stable
    ? {
      code: fields.length
        ? 'ONBOARDING_SHADOW_DATA_MISMATCH'
        : 'ONBOARDING_SHADOW_RETRY_MISMATCH',
      ...(fields.length ? { fields } : {}),
      status: 'failed',
    }
    : { status: 'succeeded' });
};

export type { ComparableProfile, OnboardingCanaryInput };
