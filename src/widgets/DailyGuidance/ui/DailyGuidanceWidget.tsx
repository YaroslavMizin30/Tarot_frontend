import { useNavigate } from 'react-router';

import {
  getDailyGuidance,
  Moon,
  useDailyEphemeris,
} from '@/entities/Horoscope';
import useLocales from '@/shared/hooks/useLocales';
import Zodiac from '@/shared/ui/Zodiac';

import styles from './DailyGuidanceWidget.module.css';

export const DailyGuidanceWidget = () => {
  const navigate = useNavigate();
  const { locale, i18n } = useLocales();
  const {
    astrology,
    bodies,
    error,
    isLoading,
    isMoonVoidOfCourse,
    timestamp,
  } = useDailyEphemeris();

  const phase = astrology?.moonPhase;
  const moonSign = bodies.Moon?.sign;

  if (error) {
    return null;
  }

  if (isLoading || !phase || !moonSign || !timestamp) {
    return <div className={styles.placeholder} aria-hidden={'true'} />;
  }

  const guidance = getDailyGuidance({
    date: timestamp.slice(0, 10),
    isMoonVoidOfCourse: Boolean(isMoonVoidOfCourse),
    locale,
    moonSign,
    phase: phase.name,
  });

  return (
    <button
      type={'button'}
      className={styles.widget}
      onClick={() => navigate('/astrology')}
      aria-label={`${i18n('Astrological background')}: ${guidance.context}`}
    >
      <span className={styles.copy}>
        <span className={styles.eyebrow}>
          {i18n('Astrological background')}
        </span>
        <span className={styles.contextRow}>
          <strong className={styles.context}>{guidance.context}</strong>
          <span className={styles.signIcon} aria-hidden={'true'}>
            <Zodiac sign={moonSign} type={'small'} />
          </span>
        </span>
        <span className={styles.summary}>{guidance.summary}</span>
      </span>

      <Moon
        phase={phase.name}
        phaseAngleDeg={phase.phaseAngleDeg}
        isWaxing={phase.isWaxing}
        size={'m'}
        className={styles.moon}
      />
    </button>
  );
};
