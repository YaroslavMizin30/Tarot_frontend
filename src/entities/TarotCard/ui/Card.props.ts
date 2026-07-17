import { type CSSProperties } from 'react';

import { CardName } from '../types';

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
  /**
   * Flag if card has loading state
   */
  hasLoadingState?: boolean;
  /** Adds a subtle light sweep to the card back. */
  hasBackShimmer?: boolean;
  /**
   * Card size
   */
  size?: 'xs' | 's' | 'm' | 'l';
}
