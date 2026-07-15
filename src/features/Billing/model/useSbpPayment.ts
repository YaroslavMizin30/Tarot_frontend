import { usePayment, type PaymentStatus } from './usePayment';
import type { PaymentMethodConfig } from './usePayment';

interface UseSbpPaymentParams {
  /** Кол-во пентаклей к зачислению пользователю */
  amount: number;
  /** Сумма платежа в рублях (например, 150) */
  rubles: number;
  onSuccess?: () => void;
  onError?: (status: Exclude<PaymentStatus, null>) => void;
}

/**
 * Удобная обёртка над usePayment для оплаты через СБП.
 * Цена передаётся в рублях, конвертацию в копейки делает бэкенд.
 */
export const useSbpPayment = ({
  amount,
  rubles,
  onSuccess,
  onError,
}: UseSbpPaymentParams) => {
  const method: PaymentMethodConfig = {
    code: 'sbp',
    amount,
    price: rubles,
    currency: 'RUB',
  };

  return usePayment({ method, onSuccess, onError });
};
