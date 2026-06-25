import StarIcon from '@/shared/assets/svg/billing/telegram_star.svg';
import SBPIcon from '@/shared/assets/svg/billing/sbp.svg';

import type { Tariff } from '../types';

export const TARIFFS: Tariff[] = [
  {
    amount: 50,
    prices: [
      {
        price: 150,
        currency: '₽',
        paymentMethods: [
          {
            code: 'sbp',
            icon: <SBPIcon width={80} height={40} />,
            paymentPhrase: 'sbp_payment',
          },
        ],
      },
      {
        price: 90,
        currency: '⭐️',
        paymentMethods: [
          {
            code: 'stars',
            icon: <StarIcon width={40} height={40} />,
            paymentPhrase: 'stars_payment',
          },
        ],
      },
    ],
  },
  {
    amount: 100,
    prices: [
      {
        price: 250,
        currency: '₽',
        paymentMethods: [
          {
            code: 'sbp',
            icon: <SBPIcon width={80} height={40} />,
            paymentPhrase: 'sbp_payment',
          },
        ],
      },
      {
        price: 150,
        currency: '⭐️',
        paymentMethods: [
          {
            code: 'stars',
            icon: <StarIcon width={40} height={40} />,
            paymentPhrase: 'stars_payment',
          },
        ],
      },
    ],
    addition: 'tariff_addition_10',
  },
  {
    amount: 200,
    prices: [
      {
        price: 350,
        currency: '₽',
        paymentMethods: [
          {
            code: 'sbp',
            icon: <SBPIcon width={80} height={40} />,
            paymentPhrase: 'sbp_payment',
          },
        ],
      },
      {
        price: 200,
        currency: '⭐️',
        paymentMethods: [
          {
            code: 'stars',
            icon: <StarIcon width={40} height={40} />,
            paymentPhrase: 'stars_payment',
          },
        ],
      },
    ],
    addition: 'tariff_addition_30',
  },
];
