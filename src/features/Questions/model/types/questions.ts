import { SpreadType } from '@/shared/types/spread';

export interface Question {
  /**
   * Question text
   */
  label: string;
  /**
   * Question description
   */
  text: string;
  /**
   * Number of cards for certain question
   */
  spreadNumber: number;
  /**
   * Title of spread for the question
   */
  spreadTitle?: string;
  /**
   * Flag, if the question needs details
   */
  areDetailsNeeded?: boolean;
  /**
   * Question about details of client's situation
   */
  detailsQuestion?: string;
  /**
   * Answer for details question
   */
  detailsAnswer?: string;
  /**
   * Spread id;
   */
  spreadId: `${SpreadType}`;
}

export interface Theme {
  /**
   * Group name
   */
  name: string;
  /**
   * Questions
   */
  questions: Question[];
  /**
   * Flag if it is template or custom question
   */
  isTemplate: boolean;
}

export interface SpreadParams {
  title?: string;
  userAnswer?: string;
  question: string;
  cardsCount: number;
  details?: string;
  detailsAnswer?: string;
  id: `${SpreadType}`;
}
