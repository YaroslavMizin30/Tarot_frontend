import { type Tariff } from '@/entities/Billing';

export interface TariffSelectionProps {
  tariffs: Tariff[];
  onTariffSelect: (tariff: Tariff) => void;
}
