import { type ReactNode } from 'react';

import { type SpreadType } from '@/shared/types/spread';

export interface TarotSpreadProps {
  onSpreadTypeChange: (cardCound: number, type: SpreadType) => void;
  /**
   * Cards
   */
  children?: ReactNode | ReactNode[];
}
