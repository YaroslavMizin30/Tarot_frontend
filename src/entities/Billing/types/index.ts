import type { ReactNode } from 'react';

export type PaymentProvider = 'telegram_stars' | 'yookassa';

export type PaymentOrderStatus =
  | 'created'
  | 'pending'
  | 'paid'
  | 'cancelled'
  | 'failed'
  | 'expired';

export interface PaymentOrder {
  id: string;
  provider: PaymentProvider;
  productCode: string;
  pentacles: number;
  currency: 'XTR' | 'RUB';
  totalAmount: number;
  status: PaymentOrderStatus;
  failureCode: string | null;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
  expiresAt: string;
}

export interface PaymentCheckout {
  type: 'telegram_invoice' | 'external_url';
  url: string;
}

export interface PaymentOffer {
  provider: PaymentProvider;
  currency: 'XTR' | 'RUB';
  totalAmount: number;
}

export interface PaymentProduct {
  code: string;
  pentacles: number;
  offers: PaymentOffer[];
}

export interface PaymentMethod {
  icon?: ReactNode;
  provider: PaymentProvider;
  paymentPhrase: string;
}

export interface Price {
  price: number;
  currency: string | ReactNode;
  paymentMethods: PaymentMethod[];
}

export interface Tariff {
  productCode: string;
  amount: number;
  prices: Price[];
  addition?: string;
}
