import { useUser } from '../useUser/useUser';

import { isTrialAvailable } from '../../../lib/isTrialAvailable';
import { checkSubscriptionStatus } from '../../../lib/checkSubscriptionStatus';
import useLocales from '@/shared/hooks/useLocales';

const MAX_FREE_SPREADS = 3;

export const useSubscription = () => {
  const { user } = useUser();

  const { i18n } = useLocales();

  const { tariff, freeSpreads, expirationDate } = user ?? {};

  const { daysLeft, isExpired, isExpiringSoon } = checkSubscriptionStatus(
    String(expirationDate),
  );

  const getExpiredMessage = () => {
    if (tariff === 'standard') {
      return i18n('Available for extended tariff');
    } else if (tariff === 'trial' && !isTrialAvailable(Number(freeSpreads))) {
      return i18n('No free queries left 😔. Available via subscription');
    } else if (isExpired) {
      return i18n(
        'Your subscription has expired 😔. Available via subscription',
      );
    } else {
      return i18n('Available via subscription');
    }
  };

  const isAvailableForCurrentTariff = (tariffs: {
    trial: boolean;
    standard: boolean;
    extended: boolean;
  }) => {
    return (
      (tariff && tariffs[tariff]) ||
      (tariff === 'trial' && isTrialAvailable(Number(freeSpreads)))
    );
  };

  return {
    isTrialAvailable: isTrialAvailable(Number(freeSpreads)),
    daysLeft,
    isExpired,
    isExpiringSoon,
    tariff,
    leftFreeSpreads: MAX_FREE_SPREADS - Number(freeSpreads),
    getExpiredMessage,
    isAvailableForCurrentTariff,
  };
};
