import { backend } from '@/shared/api/backend';

interface CompleteUserOnboardingParams {
  userName: string;
  birthDate: string;
  birthPlace?: string;
  birthTime?: string;
}

export const completeUserOnboarding = async ({
  userName,
  birthDate,
  birthPlace = '',
  birthTime = '',
}: CompleteUserOnboardingParams): Promise<number> => {
  const data = await backend.rpc<number>('complete_user_onboarding', {
    p_user_name: userName,
    p_birth_date: birthDate,
    p_birth_place: birthPlace,
    p_birth_time: birthTime,
  });

  const userId = Number(data);
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new Error('USER_ONBOARDING_FAILED');
  }

  return userId;
};
