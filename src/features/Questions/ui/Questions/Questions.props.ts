import type { SpreadParams } from '../../model/types/questions';

export interface QuestionProps {
  /**
   * Callback on spread select
   */
  onSpreadSelect: (question: SpreadParams) => void;
}
