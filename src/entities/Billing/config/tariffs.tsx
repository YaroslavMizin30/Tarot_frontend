import StarIcon from '@/shared/assets/svg/billing/telegram_star.svg';
import TelegramIcon from '@/shared/assets/svg/billing/telegram.svg';
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
          { code: 'sbp', icon: <SBPIcon width={80} height={40} />, paymentPhrase: 'через СБП' },
        ],
      },
      {
        price: 90,
        currency: <StarIcon width={20} height={20} />,
        paymentMethods: [
          {
            code: 'stars',
            icon: <TelegramIcon width={40} height={40} />,
            paymentPhrase: 'Telegram Stars',
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
          { code: 'sbp', icon: <SBPIcon width={80} height={40} />, paymentPhrase: 'через СБП' },
        ],
      },
      {
        price: 150,
        currency: <StarIcon width={20} height={20} />,
        paymentMethods: [
          {
            code: 'stars',
            icon: <TelegramIcon width={40} height={40} />,
            paymentPhrase: 'Telegram Stars',
          },
        ],
      },
    ],
    addition: '+ 10 horoscopes',
  },
  {
    amount: 200,
    prices: [
      {
        price: 350,
        currency: '₽',
        paymentMethods: [
          { code: 'sbp', icon: <SBPIcon width={80} height={40} />, paymentPhrase: 'через СБП' },
        ],
      },
      {
        price: 200,
        currency: <StarIcon width={20} height={20} />,
        paymentMethods: [
          {
            code: 'stars',
            icon: <TelegramIcon width={40} height={40} />,
            paymentPhrase: 'Telegram Stars',
          },
        ],
      },
    ],
    addition: '+ 30 horoscopes',
  },
];
