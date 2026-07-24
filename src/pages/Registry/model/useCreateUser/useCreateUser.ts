import { useState } from 'react';

import { authenticateCurrentPlatform } from '@/shared/api/auth';
import {
  assertSupportedPlatformBackendConfig,
  completeCanonicalOnboarding,
  getPlatformBackendConfig,
} from '@/shared/api/platformBackend';
import useLocales from '@/shared/hooks/useLocales';

import {
  completeOnboarding,
  useAuthProfile,
  useUser,
} from '@/entities/User/index.ts';
import { compareOnboardingCanary } from '@/entities/User/api/compareProfileCanary/compareProfileCanary';
import { createChart } from '@/widgets/NatalChart/api/createChart';

import type { CreateUserOptions } from './useCreateUser.types.ts';

export const useCreateUser = () => {
  const { locale } = useLocales();
  const [isLoading, setIsLoading] = useState(false);
  const backendConfig = getPlatformBackendConfig();
  const usesAuthoritativeProfile =
    backendConfig.mode === 'authoritative-profile';
  const {
    user: legacyUser,
    refetchUser,
    isLoading: isUserLoading,
  } = useUser({
    enabled:
      !usesAuthoritativeProfile ||
      backendConfig.legacyProductApiCompatibility,
  });
  const {
    profile,
    refetchProfile,
    isLoading: isProfileLoading,
  } = useAuthProfile({ enabled: usesAuthoritativeProfile });

  const [error, setError] = useState<string | null | unknown>(null);

  const refetchVisibleProfile = async () => {
    if (usesAuthoritativeProfile) {
      const canonicalProfile = (await refetchProfile()).data?.profile;

      if (
        backendConfig.legacyProductApiCompatibility &&
        !(await refetchUser()).data
      ) {
        return null;
      }

      return canonicalProfile;
    }

    return (await refetchUser()).data;
  };

  const createUser = async (options: CreateUserOptions) => {
    const {
      day,
      year,
      month,
      name,
      country,
      city,
      time,
      withNatalChart = false,
    } = options;

    const date = `${day}.${month}.${year}`;
    const place = country && city ? `${country}, ${city}` : '';

    try {
      setError(null);
      setIsLoading(true);

      const onboardingInput = {
        userName: name,
        birthDate: date,
        birthPlace: place,
        birthTime: time ?? '',
      };
      let completedUser = legacyUser;

      if (usesAuthoritativeProfile) {
        assertSupportedPlatformBackendConfig(backendConfig);
        const response = await completeCanonicalOnboarding({
          ...onboardingInput,
          birthDate: `${year}-${month}-${day}`,
          birthTime: time ?? null,
        });

        if (response.onboardingRequired) {
          throw new Error('PLATFORM_ONBOARDING_NOT_VISIBLE');
        }
      }

      if (
        !usesAuthoritativeProfile ||
        backendConfig.legacyProductApiCompatibility
      ) {
        await authenticateCurrentPlatform();
        completedUser = await completeOnboarding(onboardingInput);

        compareOnboardingCanary(completedUser, onboardingInput)
          .catch(() => undefined);
      }

      if (
        withNatalChart &&
        (
          !usesAuthoritativeProfile ||
          backendConfig.legacyProductApiCompatibility
        )
      ) {
        await createChart({
          name,
          year,
          month,
          day,
          timeKnown: Boolean(time),
          hour: time?.split(':')[0],
          minute: time?.split(':')[1],
          city: city ?? '',
          country,
          lang: locale === 'ru' ? 'ru-RU' : 'en-EN',
        });
      }

      const visibleProfile = await refetchVisibleProfile();
      if (!visibleProfile) {
        throw new Error('USER_ONBOARDING_NOT_VISIBLE');
      }
    } catch (e) {
      // The transaction may have committed even if its HTTP response was
      // interrupted. Re-read the profile before presenting a retry error.
      const visibleProfile = await refetchVisibleProfile();
      if (!visibleProfile) {
        setError(e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createUser,
    isLoading:
      isLoading ||
      (usesAuthoritativeProfile ? isProfileLoading : isUserLoading),
    error,
    user: usesAuthoritativeProfile ? profile : legacyUser,
  };
};
