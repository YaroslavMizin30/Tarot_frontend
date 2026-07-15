import { useState } from 'react';

import { createInvoiceLink } from '@/shared/api/telegram';
import type { PaymentMethodCode } from '@/shared/api/telegram';
import useLocales from '@/shared/hooks/useLocales';

export type PaymentStatus =
  | 'paid'
  | 'cancelled'
  | 'failed'
  | 'pending'
  | 'network_error'
  | 'unsupported'
  | null;

export interface PaymentMethodConfig {
  code: PaymentMethodCode;
  /** Кол-во пентаклей к зачислению */
  amount: number;
  /** Сумма платежа в минимальных единицах валюты (для XTR — звёзды, для RUB — копейки) */
  price: number;
  /** Валюта для title/description */
  currency: 'XTR' | 'RUB' | string;
}

interface UsePaymentParams {
  method: PaymentMethodConfig;
  onSuccess?: () => void;
  onError?: (status: Exclude<PaymentStatus, null>) => void;
}

/**
 * Универсальный хук оплаты через Telegram.
 * Поддерживает любые методы, описанные в PaymentMethodCode
 * (сейчас: 'stars' через Telegram Stars, 'sbp' через СБП).
 * При добавлении нового метода нужно:
 *   1) расширить enum в createInvoiceLink.types.ts;
 *   2) добавить ветку в Edge Function;
 *   3) при необходимости — отдельный флоу запуска.
 */
export const usePayment = ({
  method,
  onSuccess,
  onError,
}: UsePaymentParams) => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<PaymentStatus>(null);

  const { code, amount, price, currency } = method;

  const { i18n } = useLocales();

  const pay = async () => {
    if (!window.Telegram?.WebApp) {
      const next: Exclude<PaymentStatus, null> = 'network_error';
      setStatus(next);
      onError?.(next);
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      const invoice = await createInvoiceLink({
        code,
        amount,
        price,
        currency,
        title: `${amount} ${i18n('coins')}`,
        description: `${i18n('Top up')} ${amount} ${i18n('coins')}`,
        payload: `${code}:${amount}:${Date.now()}`,
      });

      if (code === 'stars' && invoice) {
        window.Telegram.WebApp.openInvoice(
          invoice.invoiceLink,
          (nextStatus) => {
            setStatus(nextStatus);
            setIsLoading(false);

            if (nextStatus === 'paid') {
              onSuccess?.();
            } else {
              onError?.(nextStatus);
            }
          },
        );
      }
    } catch {
      setIsLoading(false);
      const next: Exclude<PaymentStatus, null> = 'network_error';
      setStatus(next);
      onError?.(next);
    }
  };

  return { pay, isLoading, status };
};
