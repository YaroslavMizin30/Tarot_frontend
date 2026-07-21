import { useEffect, useRef, useState } from 'react';

import {
  createPayment,
  getPayment,
  type PaymentOrderStatus,
  type PaymentProvider,
} from '@/entities/Billing';

import { useBalance } from './useBalance';

export type PaymentStatus =
  | PaymentOrderStatus
  | 'network_error'
  | 'unsupported'
  | null;

export interface PaymentMethodConfig {
  provider: PaymentProvider;
  productCode: string;
}

interface UsePaymentParams {
  method: PaymentMethodConfig;
  onSuccess?: () => void;
  onError?: (status: Exclude<PaymentStatus, null>) => void;
}

const SBP_POPUP_FEATURES =
  'width=480,height=720,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes';
const POLL_INTERVAL_MS = 2_500;
const MAX_POLL_ATTEMPTS = 96;

const delay = (duration: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });

const isTerminalFailure = (
  status: PaymentOrderStatus,
): status is 'cancelled' | 'failed' | 'expired' =>
  status === 'cancelled' || status === 'failed' || status === 'expired';

export const usePayment = ({
  method,
  onSuccess,
  onError,
}: UsePaymentParams) => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<PaymentStatus>(null);
  const { refresh: refreshBalance } = useBalance();

  const runRef = useRef(0);
  const idempotencyKeyRef = useRef<string | null>(null);

  useEffect(() => () => {
    runRef.current += 1;
  }, []);

  const fail = (next: Exclude<PaymentStatus, null>) => {
    setStatus(next);
    setIsLoading(false);
    onError?.(next);
  };

  const complete = async () => {
    setStatus('paid');
    setIsLoading(false);
    idempotencyKeyRef.current = null;
    await refreshBalance().catch(() => undefined);
    onSuccess?.();
  };

  const pollPayment = async (paymentId: string, run: number) => {
    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
      if (runRef.current !== run) return;
      try {
        const payment = await getPayment(paymentId);
        if (runRef.current !== run) return;
        setStatus(payment.status);
        if (payment.status === 'paid') {
          await complete();
          return;
        }
        if (isTerminalFailure(payment.status)) {
          idempotencyKeyRef.current = null;
          fail(payment.status);
          return;
        }
      } catch {
        // Transient provider and network failures are retried. The canonical
        // order survives this browser session and remains recoverable.
      }
      await delay(POLL_INTERVAL_MS);
    }

    if (runRef.current === run) fail('pending');
  };

  const pay = async () => {
    if (isLoading) return;

    const webApp = window.Telegram?.WebApp;
    if (method.provider === 'telegram_stars' && !webApp) {
      fail('unsupported');
      return;
    }

    // Open a blank SBP window during the original click. Navigating it after
    // the async response avoids popup blockers in regular browsers.
    const popup = method.provider === 'yookassa'
      ? window.open('about:blank', 'sbp_payment', SBP_POPUP_FEATURES)
      : null;
    if (method.provider === 'yookassa' && !popup) {
      fail('unsupported');
      return;
    }

    setIsLoading(true);
    setStatus('created');
    const run = runRef.current + 1;
    runRef.current = run;
    idempotencyKeyRef.current ??= crypto.randomUUID();

    try {
      const result = await createPayment({
        provider: method.provider,
        productCode: method.productCode,
        idempotencyKey: idempotencyKeyRef.current,
      });

      if (result.payment.status === 'paid') {
        popup?.close();
        await complete();
        return;
      }
      if (isTerminalFailure(result.payment.status)) {
        popup?.close();
        idempotencyKeyRef.current = null;
        fail(result.payment.status);
        return;
      }

      if (!result.checkout) {
        popup?.close();
        fail('network_error');
        return;
      }

      pollPayment(result.payment.id, run).catch(() => {
        if (runRef.current === run) fail('network_error');
      });

      if (method.provider === 'telegram_stars') {
        webApp?.openInvoice(result.checkout.url, (nextStatus) => {
          if (nextStatus === 'cancelled' || nextStatus === 'failed') {
            runRef.current += 1;
            fail(nextStatus);
          }
          // `paid` is only a UI signal. The bot webhook settles the canonical
          // order; polling above waits for that server-side confirmation.
        });
        return;
      }

      try {
        popup?.location.replace(result.checkout.url);
        popup?.focus();
      } catch {
        popup?.close();
        runRef.current += 1;
        fail('unsupported');
      }
    } catch {
      popup?.close();
      fail('network_error');
    }
  };

  return { pay, isLoading, status };
};
