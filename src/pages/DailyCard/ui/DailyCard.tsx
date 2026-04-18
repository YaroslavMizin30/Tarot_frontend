import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router';
import Button from '@/shared/ui/Button';

import TarotSpread from '@/features/TarotSpread';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/daily';
import TRANSLATIONS_RU from '@/shared/locales/ru/daily';
import Spinner from '@/shared/ui/Spinner';
import Zodiac from '@/shared/ui/Zodiac';

import { useUserData } from '@/entities/User';
import { useSpreads } from '@/entities/Spread';

import { updateDaily } from '../api/updateDaily';

import styles from './DailyCard.module.css';

export const DailyCard = () => {
  const { i18n, addTranslations, locale } = useLocales();

  const { userData } = useUserData();
  const { isLoading, lastDaily } = useSpreads();

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  const handleSpreadFinish = async () => {
    const nextDaily = dayjs().add(1, 'day').toISOString();

    if (userData) {
      await updateDaily(userData?.id, nextDaily);
    }
  };

  if (isLoading) {
    return <Spinner size={'l'} />;
  }

  const date = new Date().getTime();
  const daily = new Date(lastDaily ?? '').getTime();

  if (daily > date) {
    return (
      <div className={styles.empty}>
        <Zodiac sign={userData?.sign} />

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
      }}
      onSpreadFinish={handleSpreadFinish}
    />
  );
};
