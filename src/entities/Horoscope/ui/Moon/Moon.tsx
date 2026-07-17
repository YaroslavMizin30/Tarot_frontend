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
  const { phase, size, className = '', style } = props;

  const rootClassName = [
    styles.moon,
    size === 's' ? styles.moonSmall : styles.moonLarge,
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

      <div
        className={`${styles.shadow} ${styles[PHASE_CLASS_NAMES[phase]]}`}
      />
    </div>
  );
};

export default Moon;
