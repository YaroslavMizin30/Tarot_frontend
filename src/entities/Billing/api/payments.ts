import { backend } from '@/shared/api/backend';

import type {
  PaymentCheckout,
  PaymentOrder,
  PaymentProduct,
  PaymentProvider,
} from '../types';

interface CatalogResponse {
  products: PaymentProduct[];
}

interface PaymentResponse {
  payment: PaymentOrder;
  checkout?: PaymentCheckout | null;
}

const isPaymentProduct = (value: unknown): value is PaymentProduct => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const product = value as PaymentProduct;
  return (
    typeof product.code === 'string' &&
    Number.isSafeInteger(product.pentacles) &&
    product.pentacles > 0 &&
    Array.isArray(product.offers) &&
    product.offers.length > 0 &&
    product.offers.every((offer) =>
      (offer.provider === 'telegram_stars' || offer.provider === 'yookassa') &&
      (offer.currency === 'XTR' || offer.currency === 'RUB') &&
      Number.isFinite(offer.totalAmount) &&
      offer.totalAmount > 0
    )
  );
};

const hasProducts = (value: unknown): value is CatalogResponse => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const products = (value as CatalogResponse).products;
  return Array.isArray(products) && products.every(isPaymentProduct);
};

const hasPayment = (value: unknown): value is PaymentResponse =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as PaymentResponse).payment?.id === 'string';

export const getPaymentCatalog = async (): Promise<PaymentProduct[]> => {
  const response = await backend.invoke<unknown>('payments', {
    action: 'catalog',
  });
  if (!hasProducts(response)) throw new Error('INVALID_PAYMENT_CATALOG');
  return response.products;
};

export const createPayment = async (input: {
  provider: PaymentProvider;
  productCode: string;
  idempotencyKey: string;
}): Promise<PaymentResponse> => {
  const response = await backend.invoke<unknown>('payments', {
    action: 'create',
    ...input,
  });
  if (!hasPayment(response)) throw new Error('INVALID_PAYMENT_RESPONSE');
  return response;
};

export const getPayment = async (
  paymentId: string,
): Promise<PaymentOrder> => {
  const response = await backend.invoke<unknown>('payments', {
    action: 'status',
    paymentId,
  });
  if (!hasPayment(response)) throw new Error('INVALID_PAYMENT_RESPONSE');
  return response.payment;
};
