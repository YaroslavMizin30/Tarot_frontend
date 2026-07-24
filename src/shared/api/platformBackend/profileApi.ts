import { SessionTransportError } from '@/shared/api/session';

import { getPlatformSessionTransport } from './platformApi';
import {
  parseCanonicalProfileResponse,
  type CanonicalProfileResponse,
} from './profileContract';

export interface CompleteCanonicalOnboardingPayload {
  birthDate: string;
  birthPlace?: string;
  birthTime?: string | null;
  userName: string;
}

const parseResponse = (value: unknown): CanonicalProfileResponse => {
  const response = parseCanonicalProfileResponse(value);
  if (!response) {
    throw new SessionTransportError('PLATFORM_PROFILE_RESPONSE_INVALID');
  }
  return response;
};

export const getCanonicalProfile = async () =>
  parseResponse(
    await getPlatformSessionTransport().requestJson('/v1/profile'),
  );

export const completeCanonicalOnboarding = async (
  payload: CompleteCanonicalOnboardingPayload,
) =>
  parseResponse(
    await getPlatformSessionTransport().requestJson('/v1/profile', {
      body: JSON.stringify(payload),
      headers: { 'content-type': 'application/json' },
      method: 'PUT',
    }),
  );
