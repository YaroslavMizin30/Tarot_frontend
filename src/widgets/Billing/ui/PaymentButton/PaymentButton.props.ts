import type { PaymentMethod } from "../../lib/formPaymentMethod";

export interface PaymentButtonProps extends PaymentMethod {
  onClick: (code: string) => void;
}
