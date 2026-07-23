import {
  requestPlatformAuthCanary,
  type CompleteOnboardingCanaryPayload,
  type PlatformAuthCanaryRequestResult,
} from '@/shared/api/auth/platformAuthCanary';

import type { User } from '../../types/user';

const READ_STATUS_STORAGE_KEY = 'tarotopia:profile-shadow-canary-status';
const ONBOARDING_STATUS_STORAGE_KEY =
  'tarotopia:onboarding-shadow-canary-status';
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

type CanonicalProfile = {
  appUserId: string;
  audio: boolean;
  birthDate: string;
  birthPlace: string;
  birthTime: string | null;
  theme: User['theme'];
  userName: string;
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

const parseCanonicalProfile = (
  value: unknown,
): CanonicalProfile | null => {
  if (!isObject(value)) return null;

  const profile = value.profile;
  if (!isObject(profile)) return null;

  const {
    appUserId,
    audio,
    birthDate,
    birthPlace,
    birthTime,
    theme,
    userName,
  } = profile;

  if (
    typeof appUserId !== 'string' ||
    !UUID_PATTERN.test(appUserId) ||
    typeof audio !== 'boolean' ||
    typeof birthDate !== 'string' ||
    typeof birthPlace !== 'string' ||
    (typeof birthTime !== 'string' && birthTime !== null) ||
    !['standard', 'gray', 'bronze'].includes(String(theme)) ||
    typeof userName !== 'string'
  ) {
    return null;
  }

  return {
    appUserId,
    audio,
    birthDate,
    birthPlace,
    birthTime: normalizeBirthTime(birthTime),
    theme: theme as User['theme'],
    userName,
  };
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

  const profile = parseCanonicalProfile(result.data);
  return profile
    ? { profile, status: 'succeeded' }
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

  if (!isObject(result.data)) {
    saveStatus(READ_STATUS_STORAGE_KEY, {
      code: 'PROFILE_SHADOW_RESPONSE_INVALID',
      status: 'failed',
    });
    return;
  }

  if (!current) {
    const matches = result.data.profile === null &&
      result.data.onboardingRequired === true;
    saveStatus(READ_STATUS_STORAGE_KEY, matches
      ? { status: 'succeeded' }
      : { code: 'PROFILE_SHADOW_ONBOARDING_MISMATCH', status: 'failed' });
    return;
  }

  const candidate = parseCanonicalProfile(result.data);
  if (!candidate) {
    saveStatus(READ_STATUS_STORAGE_KEY, {
      code: 'PROFILE_SHADOW_RESPONSE_INVALID',
      status: 'failed',
    });
    return;
  }

  const mismatches = mismatchFields(current, candidate);
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
