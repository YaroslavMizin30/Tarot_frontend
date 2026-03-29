import type { GetUserResponse } from '@/entities/User/types/user';

export interface UseUserDataResult {
  isLoading: boolean;
  userData: GetUserResponse | null;
}
