import { useEffect, useMemo, useState, type CSSProperties } from 'react';

import { Moon, useDailyEphemeris } from '@/entities/Horoscope';
import useLocales from '@/shared/hooks/useLocales';

import { getDayPeriod } from '../lib/getDayPeriod';
import styles from './DaySky.module.css';

const BACK_CLOUDS = [
  'cloudFarLeft',
  'cloudFarRight',
  'cloudMiddle',
] as const;

const FRONT_CLOUDS = [
  'cloudFrontLeft',
  'cloudFrontCenter',
  'cloudFrontRight',
] as const;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const getSkyTime = () => new Date();

export const DaySky = () => {
  const { locale } = useLocales();
  const { astrology } = useDailyEphemeris();
  const [now, setNow] = useState(getSkyTime);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const updateAtNextMinute = () => {
      const delay = 60_000 - (Date.now() % 60_000) + 50;
      timer = setTimeout(() => {
        setNow(getSkyTime());
        updateAtNextMinute();
      }, delay);
    };

    updateAtNextMinute();
    return () => clearTimeout(timer);
  }, []);

  const hour = now.getHours() + now.getMinutes() / 60;
  const period = getDayPeriod(now.getHours());
  const showsSun = hour >= 5 && hour < 20;
  const celestialHour = showsSun ? hour : hour < 5 ? hour + 24 : hour;
  const progress = clamp(showsSun
    ? (celestialHour - 5) / 15
    : (celestialHour - 20) / 9);
  const orbX = 10 + progress * 72;
  const orbY = 25 - Math.sin(progress * Math.PI) * 14;
  const cloudShadowX = 14 - progress * 28;
  const cloudLightAngle = 42 + progress * 96;
  const phase = astrology?.moonPhase;

  const time = useMemo(
    () => new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(now),
    [locale, now],
  );

  const skyStyle = {
    '--orb-x': `${orbX}%`,
    '--orb-y': `${orbY}%`,
    '--cloud-shadow-x': `${cloudShadowX}px`,
    '--cloud-light-angle': `${cloudLightAngle}deg`,
  } as CSSProperties;

  return (
    <div
      className={`${styles.sky} ${styles[period]}`}
      data-period={period}
      data-celestial={showsSun ? 'sun' : 'moon'}
      style={skyStyle}
    >
      <div className={styles.stars} />
      <div className={styles.haze} />
      <div className={`${styles.cloudBank} ${styles.cloudBankBack}`}>
        {BACK_CLOUDS.map((cloud) => (
          <span key={cloud} className={`${styles.cloud} ${styles[cloud]}`} />
        ))}
      </div>
      <div className={styles.lightVeil} />

      <div className={styles.orbTrack}>
        <div className={styles.orbGlow} />
        {showsSun ? (
          <div className={styles.sun} />
        ) : phase ? (
          <Moon
            phase={phase.name}
            phaseAngleDeg={phase.phaseAngleDeg}
            isWaxing={phase.isWaxing}
            size={'l'}
            className={styles.moon}
          />
        ) : (
          <div className={styles.moonFallback} />
        )}
      </div>

      <div className={`${styles.cloudBank} ${styles.cloudBankFront}`}>
        {FRONT_CLOUDS.map((cloud) => (
          <span key={cloud} className={`${styles.cloud} ${styles[cloud]}`} />
        ))}
      </div>

      <time className={styles.time} dateTime={now.toISOString()}>{time}</time>
      <div className={styles.softEdge} />
    </div>
  );
};

export default DaySky;
