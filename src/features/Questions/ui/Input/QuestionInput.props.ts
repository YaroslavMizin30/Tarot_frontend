import type { SpreadParams } from '@/entities/Spread';

export interface QuestionInputProps {
  spread: SpreadParams;
  onQuestionInput: (question: string) => void;
}
