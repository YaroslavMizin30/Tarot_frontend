import { useEffect, useRef, useState } from 'react';

import { createInvoiceLink } from '@/shared/api/telegram';
import type { PaymentMethodCode } from '@/shared/api/telegram';
import useLocales from '@/shared/hooks/useLocales';

import { useBalance } from './useBalance';

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
  /**
   * Сумма платежа в единицах валюты.
   * Для XTR (Stars) — это кол-во звёзд.
   * Для RUB (СБП) — это рубли. Конвертацию в копейки выполняет бэкенд.
   */
  price: number;
  /** Код валюты (XTR для Stars, RUB для СБП) */
  currency: 'XTR' | 'RUB' | string;
}

interface UsePaymentParams {
  method: PaymentMethodConfig;
  onSuccess?: () => void;
  onError?: (status: Exclude<PaymentStatus, null>) => void;
}

/**
 * Параметры окна для window.open при оплате через СБП.
 * Ширина/высота подобраны так, чтобы пользователю было удобно
 * оплатить через мобильный банк (в том числе в Telegram Desktop).
 */
const SBP_POPUP_FEATURES =
  'width=480,height=720,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes';

/**
 * Универсальный хук оплаты через Telegram.
 * Поддерживает любые методы, описанные в PaymentMethodCode
 * (сейчас: 'stars' через Telegram Stars, 'sbp' через СБП).
 *
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

  const { topUp, refresh: refreshBalance } = useBalance();

  // Ref для отслеживания попапа СБП, чтобы корректно чистить интервал
  // при размонтировании компонента / новом запуске оплаты.
  const sbpPopupRef = useRef<Window | null>(null);
  const sbpPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Чистим интервал опроса попапа при размонтировании
  useEffect(() => {
    return () => {
      if (sbpPollRef.current !== null) {
        clearInterval(sbpPollRef.current);
        sbpPollRef.current = null;
      }
    };
  }, []);

  const fail = (next: Exclude<PaymentStatus, null>) => {
    setStatus(next);
    setIsLoading(false);
    onError?.(next);
  };

  /**
   * Запускает polling закрытия попапа СБП.
   * После закрытия попапа вызываем onSuccess — окончательный статус
   * платежа определяется на бэкенде (он пришлёт push/webhook и обновит
   * баланс пользователя). Здесь же мы лишь сигнализируем UI,
   * что процесс оплаты пользователь завершил.
   */
  const watchSbpPopup = (popup: Window) => {
    if (sbpPollRef.current !== null) {
      clearInterval(sbpPollRef.current);
    }

    sbpPollRef.current = setInterval(() => {
      if (popup.closed) {
        if (sbpPollRef.current !== null) {
          clearInterval(sbpPollRef.current);
          sbpPollRef.current = null;
        }

        sbpPopupRef.current = null;

        // Если пользователь закрыл попап — считаем оплату завершённой.
        // Баланс обновляется на бэкенде, поэтому здесь подтягиваем его.
        setIsLoading(false);
        setStatus('paid');
        // СБП: баланс зачисляется на бэкенде — рефетчим пользователя,
        // чтобы UI сразу отобразил актуальное значение.
        refreshBalance().catch(() => undefined);
        onSuccess?.();
      }
    }, 500);
  };

  const pay = async () => {
    if (!window.Telegram?.WebApp) {
      fail('network_error');
      return;
    }

    // Если уже идёт оплата — игнорируем повторные клики
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setStatus('pending');

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

      if (!invoice) {
        fail('network_error');
        return;
      }

      if (code === 'stars') {
        window.Telegram.WebApp.openInvoice(
          invoice.invoiceLink,
          (nextStatus) => {
            setStatus(nextStatus);
            setIsLoading(false);

            if (nextStatus === 'paid') {
              // Telegram Stars: пополнение происходит на клиенте,
              // т.к. мы точно знаем, что инвойс был оплачен.
              topUp(amount).catch(() => undefined);
              onSuccess?.();
            } else {
              onError?.(nextStatus);
            }
          },
        );

        return;
      }

      if (code === 'sbp') {
        // СБП-провайдер возвращает обычный URL, по которому пользователь
        // проходит оплату во внешнем окне (мобильный банк / сайт банка).
        // Открываем его в popup согласно требованию UX.
        const popup = window.open(
          invoice.invoiceLink,
          'sbp_payment',
          SBP_POPUP_FEATURES,
        );

        if (!popup) {
          // Браузер заблокировал открытие попапа (например, нет жеста пользователя
          // или включён строгий блокировщик). В Telegram WebApp такого почти не бывает,
          // но на всякий случай сообщаем об ошибке.
          fail('unsupported');
          return;
        }

        sbpPopupRef.current = popup;

        try {
          popup.focus();
        } catch {
          // no-op: фокус не критичен для оплаты
        }

        watchSbpPopup(popup);

        return;
      }

      // Неизвестный код метода (теоретически не должен случиться из-за типов)
      fail('unsupported');
    } catch {
      fail('network_error');
    }
  };

  return { pay, isLoading, status };
};
