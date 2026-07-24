export type CanonicalTheme = 'standard' | 'gray' | 'bronze';

export interface CanonicalProfile {
  appUserId: string;
  audio: boolean;
  birthDate: string;
  birthPlace: string;
  birthTime: string | null;
  createdAt: string;
  tarotProfile: Record<string, unknown> | null;
  theme: CanonicalTheme;
  updatedAt: string;
  userName: string;
}

export type CanonicalProfileResponse =
  | {
    onboardingRequired: true;
    profile: null;
  }
  | {
    onboardingRequired: false;
    profile: CanonicalProfile;
  };

type JsonObject = Record<string, unknown>;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isObject = (value: unknown): value is JsonObject =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const isTimestamp = (value: unknown): value is string =>
  typeof value === 'string' && Number.isFinite(Date.parse(value));

const isBirthDate = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

const normalizeBirthTime = (value: unknown): string | null => {
  if (value === null) return null;
  if (typeof value !== 'string' || !/^\d{2}:\d{2}/.test(value)) return null;
  return value.slice(0, 5);
};

const parseCanonicalProfile = (
  value: unknown,
): CanonicalProfile | null => {
  if (!isObject(value)) return null;

  const birthTime = normalizeBirthTime(value.birthTime);
  const theme = String(value.theme);

  if (
    typeof value.appUserId !== 'string' ||
    !UUID_PATTERN.test(value.appUserId) ||
    typeof value.audio !== 'boolean' ||
    !isBirthDate(value.birthDate) ||
    typeof value.birthPlace !== 'string' ||
    (value.birthTime !== null && birthTime === null) ||
    !isTimestamp(value.createdAt) ||
    (
      value.tarotProfile !== null &&
      value.tarotProfile !== undefined &&
      !isObject(value.tarotProfile)
    ) ||
    !['standard', 'gray', 'bronze'].includes(theme) ||
    !isTimestamp(value.updatedAt) ||
    typeof value.userName !== 'string'
  ) {
    return null;
  }

  return {
    appUserId: value.appUserId,
    audio: value.audio,
    birthDate: value.birthDate,
    birthPlace: value.birthPlace,
    birthTime,
    createdAt: value.createdAt,
    tarotProfile: isObject(value.tarotProfile)
      ? value.tarotProfile
      : null,
    theme: theme as CanonicalTheme,
    updatedAt: value.updatedAt,
    userName: value.userName,
  };
};

export const parseCanonicalProfileResponse = (
  value: unknown,
): CanonicalProfileResponse | null => {
  if (!isObject(value) || typeof value.onboardingRequired !== 'boolean') {
    return null;
  }

  if (value.onboardingRequired) {
    return value.profile === null
      ? { onboardingRequired: true, profile: null }
      : null;
  }

  const profile = parseCanonicalProfile(value.profile);
  return profile
    ? { onboardingRequired: false, profile }
    : null;
};
