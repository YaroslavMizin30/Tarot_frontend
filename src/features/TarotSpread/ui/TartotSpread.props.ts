import { type SpreadParams } from '@/features/Questions';

import type { Card } from '../model/hooks/useReading/useReading.types';

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
