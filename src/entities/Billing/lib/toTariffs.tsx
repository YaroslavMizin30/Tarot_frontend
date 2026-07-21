import StarIcon from '@/shared/assets/svg/billing/telegram_star.svg';
import SBPIcon from '@/shared/assets/svg/billing/sbp.svg';
import type { ReactNode } from 'react';

import type {
  PaymentProduct,
  PaymentProvider,
  Tariff,
} from '../types';

const providerPresentation: Record<
  PaymentProvider,
  { currency: string; paymentPhrase: string; icon: ReactNode }
> = {
  yookassa: {
    currency: '₽',
    paymentPhrase: 'sbp_payment',
    icon: <SBPIcon width={80} height={40} />,
  },
  telegram_stars: {
    currency: '⭐️',
    paymentPhrase: 'stars_payment',
    icon: <StarIcon width={40} height={40} />,
  },
};

const additionByAmount: Record<number, string | undefined> = {
  100: 'tariff_addition_10',
  200: 'tariff_addition_30',
};

export const toTariffs = (products: PaymentProduct[]): Tariff[] =>
  products
    .map((product) => ({
      productCode: product.code,
      amount: product.pentacles,
      prices: [...product.offers]
        .sort((left) => left.provider === 'yookassa' ? -1 : 1)
        .map((offer) => {
          const presentation = providerPresentation[offer.provider];
          return {
            price: offer.totalAmount,
            currency: presentation.currency,
            paymentMethods: [{
              provider: offer.provider,
              icon: presentation.icon,
              paymentPhrase: presentation.paymentPhrase,
            }],
          };
        }),
      addition: additionByAmount[product.pentacles],
    }))
    .sort((left, right) => left.amount - right.amount);
