import { useNavigate } from 'react-router';

import useLocales from '@/shared/hooks/useLocales';
import ArrowButton from '@/shared/ui/ArrowButton';
import Spinner from '@/shared/ui/Spinner';
import TRANSLATIONS_RU from '@/shared/locales/ru/forecast';
import TRANSLATIONS_EN from '@/shared/locales/en/forecast';

import { useDailyEphemeris } from '@/entities/Horoscope';

import Circle from '@/features/Circle';

import StarsComposition from '@/pages/ui/StarsComposition';

import styles from './Forecast.module.css';
import { useEffect } from 'react';

export const Forecast = () => {
  const {
    bodies,
    isLoading,
    retrogradeBodies,
    stations,
    dateTime,
  } = useDailyEphemeris();

  const { i18n, locale, addTranslations } = useLocales();
  const navigate = useNavigate();

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  if (isLoading) {
    return <Spinner size={'l'} />;
  }

  return (
    <div className={styles.container}>
      <StarsComposition />

      <h4 className={styles.title}>{dateTime}</h4>

      <div className={styles.positions}>
        <h4 className={styles.title}>{`${i18n('Planets')}`}</h4>

        <Circle className={styles.circle} bodies={bodies} />

        <div className={styles.data}>
          {retrogradeBodies?.length ? (
            <span>
              {i18n('Retrograde bodies')}: {retrogradeBodies}
            </span>
          ) : null}

          {stations?.length ? (
            <span>
              {i18n('Station bodies')}: {stations}
            </span>
          ) : null}
        </div>
      </div>

      <div className={styles.bottom}>
        <ArrowButton
          onClick={() => navigate('/astrology')}
          style={{ zIndex: 1 }}
        />
      </div>
    </div>
  );
};
