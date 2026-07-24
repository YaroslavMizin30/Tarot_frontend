import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useAuthProfile, useUser } from '@/entities/User';
import {
  assertSupportedPlatformBackendConfig,
  getPlatformBackendConfig,
} from '@/shared/api/platformBackend';

export const useAuth = () => {
  const backendConfig = getPlatformBackendConfig();
  const usesAuthoritativeProfile =
    backendConfig.mode === 'authoritative-profile';
  let configurationError: Error | null = null;

  try {
    assertSupportedPlatformBackendConfig(backendConfig);
  } catch (error) {
    configurationError = error instanceof Error
      ? error
      : new Error('PLATFORM_BACKEND_CONFIG_INVALID');
  }

  const {
    user: legacyUser,
    isLoading: isLegacyUserLoading,
    error: legacyUserError,
    refetchUser,
  } = useUser({
    enabled:
      !usesAuthoritativeProfile ||
      backendConfig.legacyProductApiCompatibility,
  });
  const {
    error: platformProfileError,
    isLoading: isPlatformProfileLoading,
    profile: platformProfile,
    refetchProfile,
  } = useAuthProfile({ enabled: usesAuthoritativeProfile });
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const authProfile = usesAuthoritativeProfile
    ? platformProfile
    : legacyUser;
  const isLoading = usesAuthoritativeProfile
    ? isPlatformProfileLoading
    : isLegacyUserLoading;
  const authError = configurationError?.message ??
    (usesAuthoritativeProfile ? platformProfileError : legacyUserError);

  useEffect(() => {
    if (!isLoading && !authError && !authProfile && pathname !== '/reg') {
      navigate('/reg', { replace: true });
    }
  }, [authError, authProfile, isLoading, navigate, pathname]);

  return {
    authProfile,
    isLoading,
    user: legacyUser,
    error: authError,
    retry: usesAuthoritativeProfile ? refetchProfile : refetchUser,
  };
};
