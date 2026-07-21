import { backend } from '@/shared/api/backend';

import type { User } from '../../types/user';

interface CompleteOnboardingParams {
  userName: string;
  birthDate: string;
  birthPlace?: string;
  birthTime?: string;
}

interface UserResponse {
  user: User;
}

export const completeOnboarding = async ({
  userName,
  birthDate,
  birthPlace = '',
  birthTime = '',
}: CompleteOnboardingParams): Promise<User> => {
  const response = await backend.invoke<UserResponse>('user-profile', {
    action: 'completeOnboarding',
    profile: {
      userName,
      birthDate,
      birthPlace,
      birthTime,
    },
  });

  return response.user;
};
