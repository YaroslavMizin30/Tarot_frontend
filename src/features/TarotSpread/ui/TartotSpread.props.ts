import type { SpreadParams } from '@/entities/Spread';

import type { Card } from '@/entities/TarotCard';

export interface TarotSpreadProps {
  /**
   * Spread
   */
  spread: SpreadParams;
  /**
   * Callback on spread finish
   */
  onSpreadFinish?: (spread: SpreadParams, cards: Card[]) => void;
  /**
   * Callback on interpretation finish
   */
  onInterpretationFinish?: () => void;
}
