import { usePayment, type PaymentStatus } from './usePayment';
import type { PaymentMethodConfig } from './usePayment';

interface UseStarsPaymentParams {
  amount: number;
  stars: number;
  onSuccess?: () => void;
  onError?: (status: Exclude<PaymentStatus, null>) => void;
}

/**
 * Удобная обёртка над usePayment для оплаты Telegram Stars.
 * Сохранена для обратной совместимости с существующими вызовами.
 */
export const useStarsPayment = ({
  amount,
  stars,
  onSuccess,
  onError,
}: UseStarsPaymentParams) => {
  const method: PaymentMethodConfig = {
    code: 'stars',
    amount,
    price: stars,
    currency: 'XTR',
  };

  return usePayment({ method, onSuccess, onError });
};
