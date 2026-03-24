import type { Question } from '../../model/types/questions';

export interface ListProps {
  questions: Question[];
  onQuestionChoose: (question: Question) => void;
  /**
   * Current theme name
   */
  currentTheme: string;
}
