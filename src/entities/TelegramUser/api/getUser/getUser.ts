import { getHostPlatform } from '@/shared/lib/hostPlatform';

export const getTelegramUser = () => {
  const user = getHostPlatform().getUser();
  if (!user || user.provider !== 'telegram') return null;

  return {
    id: Number(user.externalUserId),
    first_name: user.firstName,
    last_name: user.lastName,
    username: user.username,
    language_code: user.languageCode,
  };
};
