import { useState } from 'react';
import { Link } from 'react-router';

import Questions from '@/features/Questions';
import TarotSpread from '@/features/TarotSpread';

import useLocales from '@/shared/hooks/useLocales';
import Spinner from '@/shared/ui/Spinner';
import Button from '@/shared/ui/Button';

import { useSpreads, type SpreadParams } from '@/entities/Spread';
import { useSubscription } from '@/entities/User';

import {
  setSpread,
  useAppDispatch,
  useAppSelector,
  type RootState,
} from '@/app/store';

import { Step } from '../config/steps';

import styles from './Reading.module.css';

const MAX_STANDARD_SPREADS = 5;
const MAX_EXTENDED_SPREADS = 10;

export const Reading = () => {
  const dispatch = useAppDispatch();

  const spread = useAppSelector((state: RootState) => state.spread.value);

  const { i18n } = useLocales();

  const { isLoading, todaysSpreadsCount } = useSpreads();

  const { tariff } = useSubscription();

  const [step, setStep] = useState<`${Step}`>('question');

  const handleSpreadSelect = (params: SpreadParams) => {
    dispatch(setSpread(params));

    setStep('reading');
  };

  const getMaxSpreads = () => {
    if (tariff === 'extended') {
      return MAX_EXTENDED_SPREADS;
    }

    return MAX_STANDARD_SPREADS;
  };

  const getLimitMessage = () => {
    if (tariff === 'extended') {
      return i18n(
        "You've reached the daily limit of 10 spreads for the extended tariff 😔",
      );
    }

    return i18n(
      "You've reached the daily limit of 5 spreads for the standard tariff. Upgrade to the extended tariff to get more spreads",
    );
  };

  const isLimitReached = () => {
    if (!tariff) {
      return false;
    }

    return todaysSpreadsCount >= getMaxSpreads();
  };

  if (isLoading) {
    return <Spinner size={'l'} />;
  }

  if (isLimitReached()) {
    return (
      <div className={styles.limit}>
        <span>{getLimitMessage()}</span>

        <Link className={styles.link} to={'/history'}>
          <Button>{i18n('To spreads history')}</Button>
        </Link>
      </div>
    );
  }

  switch (step) {
    case 'question':
      return <Questions onSpreadSelect={handleSpreadSelect} />;

    case 'reading':
      return <TarotSpread spread={spread} />;
  }
};

export default Reading;
