export type ConfirmedPaymentStatus = 'paid' | 'pending' | 'cancelled';

export const getPaymentStatus = async (
  paymentId: string,
): Promise<ConfirmedPaymentStatus> => {
  const { data, error } = await window.supabase.functions.invoke<{
    status: ConfirmedPaymentStatus;
  }>('payment-status', { body: { paymentId } });

  if (error || !data?.status) {
    throw error ?? new Error('PAYMENT_STATUS_UNAVAILABLE');
  }

  return data.status;
};
