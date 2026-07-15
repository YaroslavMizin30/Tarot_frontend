import type { PaymentMethod } from '../../lib/formPaymentMethod';

export interface PaymentButtonProps extends PaymentMethod {
  /** Кол-во пентаклей, которые зачисляются при оплате по этому тарифу */
  amount: number;
  onClick: (code: string) => void;
}
