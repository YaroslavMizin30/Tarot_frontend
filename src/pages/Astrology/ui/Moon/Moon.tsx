import type { MoonProps } from './Moon.props';

import styles from './Moon.module.css';

const Moon = (props: MoonProps) => {
  const { phase, size, style } = props;

  return (
    <div
      className={`${styles.moon} ${size === 's' ? styles['moon-small'] : ''} ${styles[phase]}`}
      style={style}
    >
      <div
        className={styles.spot}
        style={{ width: '10%', height: '20%', top: '20%', left: '10%' }}
      >
        <div className={styles['spot-center']}></div>
      </div>

      <div
        className={styles.spot}
        style={{ width: '10%', height: '20%', top: '50%', left: '10%' }}
      >
        <div className={styles['spot-center']}></div>
      </div>

      <div
        className={styles.spot}
        style={{ width: '10%', height: '20%', top: '20%', left: '10%' }}
      >
        <div className={styles['spot-center']}></div>
      </div>
      <div
        className={styles.spot}
        style={{ width: '15%', height: '15%', top: '30%', left: '7%' }}
      >
        <div className={styles['spot-center']}></div>
      </div>
      <div
        className={styles.spot}
        style={{ width: '15%', height: '15%', top: '45%', left: '16%' }}
      >
        <div className={styles['spot-center']}></div>
      </div>
      <div
        className={styles.spot}
        style={{ width: '20%', height: '20%', top: '15%', left: '10%' }}
      >
        <div className={styles['spot-center']}></div>
      </div>
      <div
        className={styles.spot}
        style={{ width: '20%', height: '20%', top: '15%', left: '20%' }}
      >
        <div className={styles['spot-center']}></div>
      </div>
      <div
        className={styles.spot}
        style={{ width: '10', height: '10', top: '2%', left: '20%' }}
      />
      <div
        className={styles.spot}
        style={{ width: '17%', height: '17%', top: '2%', left: '40%' }}
      />

      <div
        className={styles.spot}
        style={{ width: '20%', height: '20%', top: '45%', left: '40%' }}
      />

      <div
        className={styles.spot2}
        style={{ width: '15%', height: '15%', top: '35%', left: '30%' }}
      />

      <div
        className={styles.spot2}
        style={{ width: '15%', height: '15%', top: '50%', left: '30%' }}
      />

      <div
        className={styles.spot2}
        style={{ width: '15%', height: '15%', top: '45%', left: '20%' }}
      />

      <div
        className={styles.spot2}
        style={{ width: '20%', height: '20%', top: '34%', left: '17%' }}
      />

      <div
        className={styles.spot2}
        style={{ width: '20%', height: '20%', top: '34%', left: '17%' }}
      />

      <div className={`${styles.light} ${styles['light-small']}`} />

      <div
        className={styles.spot}
        style={{ width: '20%', height: '30%', top: '45%', left: '70%' }}
      />

      <div
        className={styles.spot}
        style={{ width: '20%', height: '20%', top: '35%', left: '60%' }}
      />

      <div
        className={styles.spot}
        style={{ width: '20%', height: '20%', top: '30%', left: '50%' }}
      />

      <div
        className={styles.spot}
        style={{ width: '20%', height: '20%', top: '45%', left: '40%' }}
      />

      <div
        className={styles.spot2}
        style={{ width: '20%', height: '20%', top: '30%', left: '30%' }}
      />

      <div
        className={styles.spot}
        style={{ width: '30%', height: '30%', top: '20%', left: '36%' }}
      />

      <div
        className={styles.spot}
        style={{ width: '30%', height: '30%', top: '20%', left: '60%' }}
      />

      <div
        className={styles.spot}
        style={{ width: '30%', height: '30%', top: '10%', left: '15%' }}
      />

      <div
        className={styles.spot2}
        style={{ width: '15%', height: '20%', top: '37%', right: '7%' }}
      />

      <div
        className={styles.spot}
        style={{ width: '30%', height: '30%', bottom: '20%', left: '16%' }}
      />

      <div
        className={styles.spot2}
        style={{ width: '20%', height: '30%', top: '30%', left: '5%' }}
      />

      <div
        className={styles.spot2}
        style={{ width: '20%', height: '30%', top: '25%', left: '20%' }}
      />

      <div
        className={styles.spot2}
        style={{ width: '25%', height: '25%', top: '15%', left: '40%' }}
      />

      <div
        className={styles.spot2}
        style={{ width: '25%', height: '25%', top: '25%', left: '60%' }}
      />

      <div
        className={styles.spot2}
        style={{ width: '15%', height: '25%', top: '60%', left: '10%' }}
      />

      <div
        className={styles.spot3}
        style={{ width: '15%', height: '25%', top: '60%', left: '36%' }}
      />

      <div
        className={styles.spot3}
        style={{ width: '5%', height: '25%', top: '60%', left: '76%' }}
      />

      <div
        className={styles.spot2}
        style={{ width: '15%', height: '25%', top: '10%', left: '10%' }}
      />

      <div
        className={styles.spot2}
        style={{ width: '25%', height: '25%', top: '10%', left: '30%' }}
      />

      <div
        className={styles.spot3}
        style={{ width: '2%', height: '25%', top: '40%', left: '30%' }}
      />

      <div
        className={styles.spot2}
        style={{ width: '15%', height: '15%', top: '60%', left: '70%' }}
      />

      <div className={`${styles.shadow} ${styles[phase]}`}></div>
    </div>
  );
};

export default Moon;
