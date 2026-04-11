import { CardName } from '@/shared/types/arcana';

export interface Card {
  /**
   * Name of card
   */
  name: CardName;
  /**
   * Flag if the card is reversed
   */
  isInverted: boolean;
}

export interface UseReadingResult {
  /**
   * Function to prepare random cards for the reading
   */
  prepareCards: (count: number) => void;
  /**
   * Current card to turn over
   */
  activeCard: number;
  /**
   * Function to change active card
   */
  changeActiveCard: () => void;
  /**
   * Array of cards to display
   */
  cards: Card[];
  /**
   * Flag if the reading is finished
   */
  isFinished: boolean;
}
