import { type Price, type PaymentMethod as Method } from '@/entities/Billing';
import type { ReactNode } from 'react';

export interface PaymentMethod extends Method {
  price: number;
  currency: ReactNode | string;
}

export const composePaymentMethods = (prices: Price[]) => {
  const methods: PaymentMethod[] = [];

  prices.forEach((item) => {
    const { price, paymentMethods, currency } = item;

    paymentMethods.forEach((method) => {
      methods.push({ ...method, price, currency });
    });
  });

  return methods;
};
