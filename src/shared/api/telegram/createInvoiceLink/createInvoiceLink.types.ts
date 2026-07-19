/**
 * Коды поддерживаемых платёжных методов.
 * Расширяйте enum при добавлении новых провайдеров.
 */
const enum PAYMENT_METHODS {
  STARS = 'stars',
  SBP = 'sbp',
}

export type PaymentMethodCode = `${PAYMENT_METHODS}`;

export interface CreateInvoiceLinkParams {
  /** Код метода оплаты: 'stars' (Telegram Stars / XTR) или 'sbp' (СБП / RUB) */
  code: PaymentMethodCode;
  /** Кол-во монет (пентаклей), которые будут зачислены пользователю */
  amount: number;
}

export interface CreateInvoiceLinkResponse {
  /** Готовая ссылка вида https://t.me/$<slug>, которую передаём в openInvoice */
  invoiceLink: string;
  /** Идентификатор платежа ЮKassa; возвращается только для СБП. */
  paymentId?: string;
}
