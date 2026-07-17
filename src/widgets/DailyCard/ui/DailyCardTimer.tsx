import { useEffect, useRef } from 'react';

import { useCountdown } from '@/shared/hooks/useCountdown';
import useLocales from '@/shared/hooks/useLocales';

import styles from './DailyCardTimer.module.css';

interface DailyCardTimerProps {
  targetDate: Date | string;
  onFinish?: () => void;
}

export const DailyCardTimer = ({ targetDate, onFinish }: DailyCardTimerProps) => {
  const { hours, minutes, seconds, isFinished } = useCountdown(targetDate);
  const { i18n } = useLocales();
  const notifiedTargetRef = useRef<string | null>(null);
  const targetKey = new Date(targetDate).toISOString();

  useEffect(() => {
    if (isFinished && notifiedTargetRef.current !== targetKey) {
      notifiedTargetRef.current = targetKey;
      onFinish?.();
    }
  }, [isFinished, onFinish, targetKey]);

  const countdown = `${hours}:${minutes}:${seconds}`;

  return (
    <div
      className={styles.timer}
      aria-label={`${i18n('Next card in')}: ${countdown}`}
    >
      <span className={styles.label}>{i18n('Next card in')}</span>
      <span className={styles.digits} aria-hidden={true}>
        {countdown}
      </span>
    </div>
  );
};
