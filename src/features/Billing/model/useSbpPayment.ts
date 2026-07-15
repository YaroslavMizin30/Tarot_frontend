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
 * Цена передаётся в рублях, конвертация в копейки выполняется
 * внутри usePayment при code === 'sbp'.
 */
export const useSbpPayment = ({
  amount,
  rubles,
  onSuccess,
  onError,
}: UseSbpPaymentParams) => {
  console.log(amount);

  const method: PaymentMethodConfig = {
    code: 'sbp',
    amount,
    // В usePayment эта сумма будет автоматически умножена на 100
    // и передана в бэкенд в копейках
    price: rubles,
    currency: 'RUB',
  };

  return usePayment({ method, onSuccess, onError });
};
