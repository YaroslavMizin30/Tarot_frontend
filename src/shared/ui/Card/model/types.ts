import { CardName } from './enums';

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
}
