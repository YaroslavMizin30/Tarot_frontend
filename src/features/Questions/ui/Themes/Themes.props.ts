import type { Question, Theme } from '../../model/types/questions';

export interface ThemeProps {
  themes: Theme[];
  onThemeChoose: (params: { questions: Question[]; name: string }) => void;
}
