import type { SpreadParams } from '@/entities/Spread';

export interface QuestionProps {
  /**
   * Callback on spread select
   */
  onSpreadSelect: (question: SpreadParams) => void;
  /** Reports the current internal step to the reading-level progress bar. */
  onStepChange?: (step: 'theme' | 'setup') => void;
}
