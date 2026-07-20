import { backend } from '@/shared/api/backend';

export type ConfirmedPaymentStatus = 'paid' | 'pending' | 'cancelled';

export const getPaymentStatus = async (
  paymentId: string,
): Promise<ConfirmedPaymentStatus> => {
  const data = await backend.invoke<{
    status: ConfirmedPaymentStatus;
  }>('payment-status', { paymentId });

  if (!data?.status) {
    throw new Error('PAYMENT_STATUS_UNAVAILABLE');
  }

  return data.status;
};
