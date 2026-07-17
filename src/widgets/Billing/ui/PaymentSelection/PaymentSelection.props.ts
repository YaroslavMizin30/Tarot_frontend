import { type Tariff } from '@/entities/Billing';

export interface PaymentSelectionProps {
  tariff: Tariff;
  onBackButtonClick: () => void;
  onPaymentSuccess?: () => void;
}
