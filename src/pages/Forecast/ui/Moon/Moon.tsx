import type { MoonProps } from './Moon.props';

import styles from './Moon.module.css';

const Moon = (props: MoonProps) => {
  const { phase, size, style = {} } = props;

  return (
    <div
      className={`${styles.moon} ${size === 's' ? styles['moon-small'] : ''}`}
      style={{
        ...style,
        overflow:
          phase === 'waxingcrescent' || phase === 'waningcrescent'
            ? 'hidden'
            : undefined,
      }}
    >
      <img
        className={styles.image}
        width={'120%'}
        height={'120%'}
        src={'assets/images/horoscope/moon.png'}
      />

      <div className={`${styles.shadow} ${styles[phase]}`}></div>
    </div>
  );
};

export default Moon;
