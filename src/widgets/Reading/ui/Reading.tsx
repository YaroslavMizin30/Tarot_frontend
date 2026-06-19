import { useState } from 'react';
import { Link } from 'react-router';

import Questions from '@/features/Questions';
import TarotSpread from '@/features/TarotSpread';

import useLocales from '@/shared/hooks/useLocales';
import Spinner from '@/shared/ui/Spinner';
import Button from '@/shared/ui/Button';
import { TARIFFS } from '@/shared/const/tariffs';

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
    switch (tariff) {
      case 'standard':
        return TARIFFS.standard.spreads;
      case 'extended':
        return TARIFFS.extended.spreads;
      default:
        return 0;
    }
  };

  const getLimitMessage = () => {
    switch (tariff) {
      case 'extended':
        return i18n(
          `You've reached the daily limit of ${TARIFFS.extended.spreads} spreads for the extended tariff 😔`,
        );

      case 'standard':
        return i18n(
          `You've reached the daily limit of ${TARIFFS.standard.spreads} spreads for the standard tariff. Upgrade to the extended tariff to get more spreads`,
        );

      default:
        return i18n("You've reached the daily limit of spreads 😔");
    }
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
