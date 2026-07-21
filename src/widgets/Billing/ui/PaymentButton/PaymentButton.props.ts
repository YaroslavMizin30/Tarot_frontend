import type { PaymentMethod } from '../../lib/formPaymentMethod';

export interface PaymentButtonProps extends PaymentMethod {
  productCode: string;
  onClick: (provider: string) => void;
}
