import { useEffect } from 'react';
import { Link } from 'react-router';
import Button from '@/shared/ui/Button';

import TarotSpread from '@/features/TarotSpread';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/daily';
import TRANSLATIONS_RU from '@/shared/locales/ru/daily';
import Spinner from '@/shared/ui/Spinner';
import Zodiac from '@/shared/ui/Zodiac';

import { useDaily } from '../hooks/useDaily';

import styles from './DailyCard.module.css';

export const DailyCard = () => {
  const { i18n, addTranslations, locale } = useLocales();

  const { isLoading, updateUserActivity, sign, id, isAvailable, error } =
    useDaily();

  const handleInterpretationsFinish = () => {
    updateUserActivity();
  };

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  if (isLoading) {
    return <Spinner size={'l'} />;
  }

  if (error) {
    return (
      <div className={styles.error}>
        {i18n(error)} <Button>{i18n('Try again')}</Button>
      </div>
    );
  }

  if (!isAvailable) {
    return (
      <div className={styles.empty}>
        <Zodiac sign={sign} />

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
