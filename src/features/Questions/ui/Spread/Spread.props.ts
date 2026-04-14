import type { SpreadParams } from '@/entities/Spread';

export interface SpreadProps {
  spread: SpreadParams;
  onSpreadChange: (spread: SpreadParams) => void;
  onSpreadSelect: (spread: SpreadParams) => void;
}
