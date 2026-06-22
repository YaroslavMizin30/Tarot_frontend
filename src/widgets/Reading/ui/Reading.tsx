import { useState } from 'react';

import Questions from '@/features/Questions';
import TarotSpread from '@/features/TarotSpread';

import useLocales from '@/shared/hooks/useLocales';

import { type SpreadParams } from '@/entities/Spread';
import { useSubscription } from '@/entities/User';

import {
  setSpread,
  useAppDispatch,
  useAppSelector,
  type RootState,
} from '@/app/store';

import { Step } from '../config/steps';

import styles from './Reading.module.css';

export const Reading = () => {
  const dispatch = useAppDispatch();

  const spread = useAppSelector((state: RootState) => state.spread.value);

  const { i18n } = useLocales();

  const { tariff } = useSubscription();

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

export default Reading;
