import type { SpreadParams } from '@/entities/Spread';

export interface QuestionProps {
  /**
   * Callback on spread select
   */
  onSpreadSelect: (question: SpreadParams) => void;
}
