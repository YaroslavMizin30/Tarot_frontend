import { useEffect } from 'react';
import { Link } from 'react-router';

import TarotSpread from '@/features/TarotSpread';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/daily';
import TRANSLATIONS_RU from '@/shared/locales/ru/daily';
import Spinner from '@/shared/ui/Spinner';
import Error from '@/shared/ui/Error';
import Button from '@/shared/ui/Button';

import { useDaily } from '../hooks/useDaily';

import styles from './DailyCard.module.css';

export const DailyCard = () => {
  const { i18n, addTranslations, locale } = useLocales();

  const {
    isLoading,
    updateUserActivity,
    id,
    isAvailable,
    error,
    checkDaily,
  } = useDaily();

  const handleInterpretationsFinish = () => {
    updateUserActivity();
  };

  const handleRetryButtonClick = () => {
    checkDaily();
  };

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
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

        <Link className={styles.link} to={'/history'}>
          <Button>{i18n('To spreads history')}</Button>
        </Link>
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
