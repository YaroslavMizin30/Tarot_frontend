import { type CSSProperties } from 'react';

import { CardName } from '@/shared/types/arcana';

export interface TarotCardProps {
  /**
   * Card name
   */
  name: `${CardName}`;
  /**
   * Boolean, if card be turned over
   */
  canTurnOver?: boolean;
  /**
   * Callback on card click
   */
  onClick?: () => void;
  /**
   * Localized card name
   */
  localizedName: string;
  /**
   * Additional class name
   */
  className?: string;
  /**
   * Styles
   */
  style?: CSSProperties;
  /**
   * Flag if card is inverted
   */
  isInverted?: boolean;
  /**
   * Flag if card is reversed
   */
  isReversed?: boolean;
}
