import { SpreadType } from '@/entities/Spread';

export interface Question {
  /** Expected depth of the reading. */
  depth?: 'quick' | 'balanced' | 'deep';
  /** Search and recommendation hints reserved for future personalization. */
  tags?: string[];
  /** Prioritize the question in the compact four-card grid. */
  featured?: boolean;
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
