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
  /** Сумма платежа в минимальных единицах валюты: для XTR — это кол-во звёзд, для RUB — копейки */
  price: number;
  /** Код валюты (XTR для Stars, RUB для СБП). Если не передан — бэкенд выберет сам по `code`. */
  currency?: string;
  /** Произвольный payload для идемпотентности и связи платежа с заказом на бэкенде */
  payload?: string;
  /** Заголовок в окне оплаты Telegram (необязательно) */
  title?: string;
  /** Описание в окне оплаты Telegram (необязательно) */
  description?: string;
}

export interface CreateInvoiceLinkResponse {
  /** Готовая ссылка вида https://t.me/$<slug>, которую передаём в openInvoice */
  invoiceLink: string;
}
