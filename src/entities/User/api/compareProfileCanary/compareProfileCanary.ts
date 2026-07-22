import { requestPlatformAuthCanary } from '@/shared/api/auth/platformAuthCanary';

import type { User } from '../../types/user';

const STATUS_STORAGE_KEY = 'tarotopia:profile-shadow-canary-status';
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type JsonObject = Record<string, unknown>;

type CanonicalProfile = {
  appUserId: string;
  audio: boolean;
  birthDate: string;
  birthPlace: string;
  birthTime: string | null;
  theme: User['theme'];
  userName: string;
};

const saveStatus = (value: JsonObject) => {
  try {
    window.sessionStorage.setItem(
      STATUS_STORAGE_KEY,
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

const parseCanonicalProfile = (value: unknown): CanonicalProfile | null => {
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
  current: User,
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

export const compareProfileCanary = async (current: User | null) => {
  if (import.meta.env.VITE_PROFILE_SHADOW_CANARY_ENABLED !== 'true') return;

  const result = await requestPlatformAuthCanary('/v1/profile');

  if (result.status === 'skipped') return;
  if (result.status === 'failed') {
    saveStatus({ code: result.code, status: 'failed' });
    return;
  }

  if (!isObject(result.data)) {
    saveStatus({ code: 'PROFILE_SHADOW_RESPONSE_INVALID', status: 'failed' });
    return;
  }

  if (!current) {
    const matches = result.data.profile === null &&
      result.data.onboardingRequired === true;
    saveStatus(matches
      ? { status: 'succeeded' }
      : { code: 'PROFILE_SHADOW_ONBOARDING_MISMATCH', status: 'failed' });
    return;
  }

  const candidate = parseCanonicalProfile(result.data);
  if (!candidate) {
    saveStatus({ code: 'PROFILE_SHADOW_RESPONSE_INVALID', status: 'failed' });
    return;
  }

  const mismatches = mismatchFields(current, candidate);
  saveStatus(mismatches.length
    ? {
      code: 'PROFILE_SHADOW_DATA_MISMATCH',
      fields: mismatches,
      status: 'failed',
    }
    : { status: 'succeeded' });
};
