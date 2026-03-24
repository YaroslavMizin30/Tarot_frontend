import type { SpreadParams } from '../../model/types/questions';

export interface QuestionInputProps {
  spread: SpreadParams;
  onQuestionInput: (question: string) => void;
}
