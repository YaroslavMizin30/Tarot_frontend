import { type Tariff } from '@/entities/Billing';

export interface TariffButtonProps extends Tariff {
  className?: string;
  onTariffSelect: (tariff: Tariff) => void;
}
