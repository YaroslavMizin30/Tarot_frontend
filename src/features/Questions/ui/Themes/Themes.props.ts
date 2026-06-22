import type { Question, Theme } from '../../model/types/questions';

export interface ThemeProps {
  themes: Theme[];
  onQuestionChoose: (question: Question) => void;
}
