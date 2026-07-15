import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';

import TarotSpread from '@/features/TarotSpread';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/daily';
import TRANSLATIONS_RU from '@/shared/locales/ru/daily';
import Spinner from '@/shared/ui/Spinner';
import Error from '@/shared/ui/Error';
import ArrowButton from '@/shared/ui/ArrowButton';

import { useDaily } from '../hooks/useDaily';
import { DailyCardTimer } from './DailyCardTimer';

import styles from './DailyCard.module.css';

export const DailyCard = () => {
  const { i18n, addTranslations, locale } = useLocales();

  const navigate = useNavigate();

  const {
    isLoading,
    updateUserActivity,
    id,
    isAvailable,
    error,
    checkDaily,
    nextAvailableAt,
  } = useDaily();

  const handleInterpretationsFinish = () => {
    updateUserActivity();
  };

  const handleRetryButtonClick = () => {
    checkDaily();
  };

  const handleTimerFinish = useCallback(() => {
    checkDaily();
  }, [checkDaily]);

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  if (isLoading) {
    return <Spinner size={'l'} />;
  }

  if (error) {
    return (
      <Error error={i18n(error)} onRetryButtonClick={handleRetryButtonClick} />
    );
  }

  if (!isAvailable) {
    return (
      <div className={styles.empty}>
        <span>{i18n("You've already had your card today")}</span>

        <DailyCardTimer
          targetDate={nextAvailableAt}
          onFinish={handleTimerFinish}
        />

        <div className={styles.action}>
          <ArrowButton onClick={() => navigate('/')} />
        </div>
      </div>
    );
  }

  return (
    <TarotSpread
      spread={{
        id: 'single',
        cardsCount: 1,
        question: i18n('Card of the day'),
        userId: Number(id),
      }}
      onInterpretationFinish={handleInterpretationsFinish}
    />
  );
};
