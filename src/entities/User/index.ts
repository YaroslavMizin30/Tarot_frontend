export { getUser } from './api/getUser/getUser';
export { completeOnboarding } from './api/completeOnboarding/completeOnboarding';
export { useUser } from './model/hooks/useUser/useUser';
export {
  useAuthProfile,
} from './model/hooks/useAuthProfile/useAuthProfile';

export type {
  User,
  UserProfileChanges,
  TarotProfile,
  TarotProfileFocus,
} from './types/user';
