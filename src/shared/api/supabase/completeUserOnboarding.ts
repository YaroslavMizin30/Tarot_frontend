import { ensureSupabase } from './ensureSupabase';

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
  await ensureSupabase();

  const { data, error } = await window.supabase.rpc(
    'complete_user_onboarding',
    {
      p_user_name: userName,
      p_birth_date: birthDate,
      p_birth_place: birthPlace,
      p_birth_time: birthTime,
    },
  );

  const userId = Number(data);
  if (error || !Number.isSafeInteger(userId) || userId <= 0) {
    throw error ?? new Error('USER_ONBOARDING_FAILED');
  }

  return userId;
};

