import { Steps } from '../../config/steps';

import type { Question } from '../types/questions';

import type { SpreadParams } from '@/entities/Spread';

export interface ChangeStepParams {
  isBack: boolean;
  value?: `${Steps}`;
}

export interface useQuestionResult {
  /**
   * Function to change the current step
   */
  changeStep: (params: ChangeStepParams) => void;
  /**
   * Function to prepare spread
   */
  changeSpread: (params: SpreadParams) => void;
  /**
   * Function to set questions list
   */
  setQuestionsList: (params: Question[]) => void;
  /**
   * Function to set current topic
   */
  changeTopic: (topic: string) => void;
  /**
   * Function to clear spread values
   */
  clearSpread: (values: Array<keyof SpreadParams>) => void;
  /**
   * Current step
   */
  step: `${Steps}`;
  /**
   * Params for spread
   */
  spread: SpreadParams;
  /**
   * Questions list
   */
  questions: Question[];
  /**
   * Current chosen topic
   */
  topic: string;
}
