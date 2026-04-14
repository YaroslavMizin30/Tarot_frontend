import type { Card } from "@/entities/TarotCard";

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
