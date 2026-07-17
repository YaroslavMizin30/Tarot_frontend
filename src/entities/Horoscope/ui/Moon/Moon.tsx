import { useId } from 'react';

import type { MoonPhaseName } from '../../types';

import type { MoonProps } from './Moon.props';

import styles from './Moon.module.css';

const PHASE_CLASS_NAMES: Record<MoonPhaseName, string> = {
  'New Moon': 'newMoon',
  'Waxing Crescent': 'waxingCrescent',
  'First Quarter': 'firstQuarter',
  'Waxing Gibbous': 'waxingGibbous',
  'Full Moon': 'fullMoon',
  'Waning Gibbous': 'waningGibbous',
  'Last Quarter': 'lastQuarter',
  'Waning Crescent': 'waningCrescent',
};

export const Moon = (props: MoonProps) => {
  const moonId = useId().replace(/:/g, '');
  const {
    phase,
    phaseAngleDeg,
    isWaxing = phase.startsWith('Waxing'),
    size,
    className = '',
    style,
  } = props;

  const hasExactPhase =
    typeof phaseAngleDeg === 'number' && Number.isFinite(phaseAngleDeg);
  const normalizedAngle = hasExactPhase
    ? ((phaseAngleDeg % 360) + 360) % 360
    : 0;
  const illumination = (1 - Math.cos((normalizedAngle * Math.PI) / 180)) / 2;
  const terminatorRadius = Math.max(0.01, 50 * Math.abs(1 - 2 * illumination));
  const outerSweep = isWaxing ? 1 : 0;
  const terminatorSweep = isWaxing
    ? illumination <= 0.5 ? 0 : 1
    : illumination <= 0.5 ? 1 : 0;
  const illuminatedPath = [
    'M 50 0',
    `A 50 50 0 0 ${outerSweep} 50 100`,
    `A ${terminatorRadius} 50 0 0 ${terminatorSweep} 50 0`,
    'Z',
  ].join(' ');
  const maskId = `moon-shadow-${moonId}`;
  const blurId = `moon-terminator-blur-${moonId}`;

  const rootClassName = [
    styles.moon,
    size === 's'
      ? styles.moonSmall
      : size === 'm'
        ? styles.moonMedium
        : styles.moonLarge,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClassName} style={style} aria-hidden={'true'}>
      <img
        className={styles.image}
        src={'/assets/images/horoscope/moon.png'}
        alt={''}
      />

      {hasExactPhase ? (
        <svg
          className={styles.exactShadow}
          viewBox={'0 0 100 100'}
          aria-hidden={'true'}
        >
          <defs>
            <filter
              id={blurId}
              x={'-12%'}
              y={'-12%'}
              width={'124%'}
              height={'124%'}
            >
              <feGaussianBlur stdDeviation={'3'} />
            </filter>
            <mask id={maskId}>
              <rect width={'100'} height={'100'} fill={'white'} />
              <path
                d={illuminatedPath}
                fill={'black'}
                filter={`url(#${blurId})`}
              />
            </mask>
          </defs>
          <circle
            cx={'50'}
            cy={'50'}
            r={'50'}
            fill={'#24242a'}
            fillOpacity={'0.92'}
            mask={`url(#${maskId})`}
          />
        </svg>
      ) : (
        <div
          className={`${styles.shadow} ${styles[PHASE_CLASS_NAMES[phase]]}`}
        />
      )}
    </div>
  );
};

export default Moon;
