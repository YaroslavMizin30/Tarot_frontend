import { type ReactNode } from 'react';

export interface TarotDeckProps {
  /**
   * Cards
   */
  children?: ReactNode | ReactNode[];
  /**
   * Additional class name
   */
  className?: string;
  /**
   * Flag if the deck is reading mode
   */
  isReading: boolean;
  /**
   * Flag, if the cards are ready
   */
  isReady: boolean;
  /**
   * Callback on reading end
   */
  onReadEnd: () => void;
}
