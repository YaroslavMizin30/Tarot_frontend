import type { ReactNode } from 'react';

const enum AVAILABLE_METHODS {
  STARS = 'stars',
  SPB = 'sbp',
}

export interface PaymentMethod {
  icon?: ReactNode;
  code: `${AVAILABLE_METHODS}`;
  paymentPhrase: string;
}

export interface Price {
  price: number;
  currency: string | ReactNode;
  paymentMethods: PaymentMethod[];
}

export interface Tariff {
  amount: number;
  prices: Price[];
  addition?: string;
}
