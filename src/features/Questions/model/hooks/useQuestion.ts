import { useState } from 'react';

import type { useQuestionResult, ChangeStepParams } from './useQuestion.types';

import { Steps } from '../../config/steps';

import type { Question } from '../types/questions';

import type { SpreadParams } from '@/entities/Spread';

export const useQuestion = (): useQuestionResult => {
  const [steps, setSteps] = useState<`${Steps}`[]>([]);
  const [step, setStep] = useState<`${Steps}`>('theme');
  const [spread, setSpread] = useState<SpreadParams>({
    cardsCount: 0,
    question: '',
    id: 'single',
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [topic, setTopic] = useState<string>('');

  const changeStep = (params: ChangeStepParams) => {
    const { isBack, value } = params;

    const newSteps = [...steps];

    if (value) {
      newSteps.push(value);
      setStep(value);
    } else if (isBack) {
      newSteps.pop();
      setStep(newSteps[newSteps.length - 1]);
    }

    setSteps(newSteps);
  };

  const changeSpread = (params: SpreadParams) => {
    setSpread(params);
  };

  const setQuestionsList = (questions: Question[]) => {
    setQuestions(questions);
  };

  const changeTopic = (topic: string) => {
    setTopic(topic);
  };

  const clearSpread = (values: Array<keyof SpreadParams>) => {
    const newValues = { ...spread };

    values.forEach((value) => {
      switch (value) {
        case 'cardsCount':
          newValues.cardsCount = 0;
          break;
        case 'question':
          newValues.question = '';
          break;

        case 'id':
          newValues.id = 'single';
          break;

        default:
          newValues[value] = undefined;
      }
    });

    setSpread(newValues);
  };

  return {
    changeSpread,
    changeStep,
    setQuestionsList,
    changeTopic,
    clearSpread,
    step,
    spread,
    questions,
    topic,
  };
};
