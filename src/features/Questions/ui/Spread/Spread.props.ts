import { type SpreadParams } from '../../model/types/questions';

export interface SpreadProps {
  spread: SpreadParams;
  onSpreadChange: (spread: SpreadParams) => void;
  onSpreadSelect: (spread: SpreadParams) => void;
}
