import { useEffect } from 'react';

import { useCountdown } from '@/shared/hooks/useCountdown';
import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/daily';
import TRANSLATIONS_RU from '@/shared/locales/ru/daily';

import styles from './DailyCardTimer.module.css';

interface DailyCardTimerProps {
  targetDate: Date | string | null;
  onFinish?: () => void;
}

const COLON = ':';

export const DailyCardTimer = ({ targetDate, onFinish }: DailyCardTimerProps) => {
  const { hours, minutes, seconds, isFinished } = useCountdown(targetDate);
  const { i18n, addTranslations, locale } = useLocales();

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
    // addTranslations intentionally omitted: it's recreated on every render
    // (the i18n hook returns a fresh closure), which would cause an
    // infinite update loop. The dispatch inside is referentially stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  useEffect(() => {
    if (isFinished && onFinish) {
      onFinish();
    }
  }, [isFinished, onFinish]);

  return (
    <div className={styles.timer} aria-live={'polite'}>
      <span className={styles.label}>{i18n('Next card available in')}</span>
      <div className={styles.digits}>
        <span className={styles.segment}>
          <span className={styles.value}>{hours}</span>
          <span className={styles.unit}>{i18n('h')}</span>
        </span>
        <span className={styles.separator}>{COLON}</span>
        <span className={styles.segment}>
          <span className={styles.value}>{minutes}</span>
          <span className={styles.unit}>{i18n('m')}</span>
        </span>
        <span className={styles.separator}>{COLON}</span>
        <span className={styles.segment}>
          <span className={styles.value}>{seconds}</span>
          <span className={styles.unit}>{i18n('s')}</span>
        </span>
      </div>
    </div>
  );
};
