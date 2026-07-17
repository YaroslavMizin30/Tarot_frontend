import type { SpreadParams } from '@/entities/Spread';

export interface SpreadProps {
  spread: SpreadParams;
  onQuestionInput: (question: string) => void;
  onSpreadChange: (spread: SpreadParams) => void;
  onSpreadPrepare: (spread: SpreadParams) => Promise<SpreadParams | null>;
  onSpreadSelect: (spread: SpreadParams) => void;
}
