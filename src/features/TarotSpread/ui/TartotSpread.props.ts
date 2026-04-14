import type { SpreadParams } from '@/entities/Spread';

import type { Card } from '@/entities/TarotCard';

export interface TarotSpreadProps {
  /**
   * Spread
   */
  spread: SpreadParams;
  /**
   *
   */
  onSpreadFinish?: (spread: SpreadParams, cards: Card[]) => void;
}
