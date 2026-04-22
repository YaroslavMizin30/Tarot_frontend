import { useState } from 'react';

import Questions from '@/features/Questions';
import TarotSpread from '@/features/TarotSpread';

import type { SpreadParams } from '@/entities/Spread';

import { Step } from '../config/steps';

import {
  setSpread,
  useAppDispatch,
  useAppSelector,
  type RootState,
} from '@/app/store';

export const Reading = () => {
  const dispatch = useAppDispatch();

  const spread = useAppSelector((state: RootState) => state.spread.value);

  const [step, setStep] = useState<`${Step}`>('question');

  const handleSpreadSelect = (params: SpreadParams) => {
    dispatch(setSpread(params));

    setStep('reading');
  };

  switch (step) {
    case 'question':
      return <Questions onSpreadSelect={handleSpreadSelect} />;

    case 'reading':
      return <TarotSpread spread={spread} />;
  }
};
