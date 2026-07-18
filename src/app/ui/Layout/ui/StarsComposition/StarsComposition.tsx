import styles from './StarsComposition.module.css';

interface StarsCompositionProps {
  isDeep?: boolean;
}

export const StarsComposition = ({ isDeep = false }: StarsCompositionProps) => {
  return (
    <div className={`${styles.composition} ${isDeep ? styles.deep : ''}`}>
      <div className={styles.smallStar} style={{ top: '35%', left: '55%' }} />
      <div className={styles.mediumStar} style={{ top: '50%', left: '45%' }} />
      <div className={styles.largeStar} style={{ top: '40%', right: '30%' }} />
      <div
        className={styles.smallStar}
        style={{ bottom: '30%', right: '20%' }}
      />
      <div className={styles.smallStar} style={{ top: '65%', left: '70%' }} />
      <div
        className={styles.smallStar}
        style={{ bottom: '15%', left: '30%' }}
      />
      <div className={styles.smallStar} style={{ top: '80%', right: '45%' }} />
      <div
        className={styles.smallStar}
        style={{ bottom: '10%', right: '55%' }}
      />
      <div className={styles.smallStar} style={{ top: '50%', left: '60%' }} />
      <div
        className={styles.largeStar}
        style={{ bottom: '25%', right: '25%' }}
      />
      <div className={styles.largeStar} style={{ top: '75%', left: '35%' }} />
      <div className={styles.largeStar} style={{ bottom: '5%', left: '50%' }} />
      <div className={styles.mediumStar} style={{ top: '35%', left: '75%' }} />
      <div
        className={styles.mediumStar}
        style={{ bottom: '35%', left: '15%' }}
      />
      <div className={styles.mediumStar} style={{ top: '60%', right: '65%' }} />
      <div
        className={styles.mediumStar}
        style={{ bottom: '20%', right: '15%' }}
      />
      <div className={styles.cloud} style={{ top: '54%', right: '32%' }}></div>
      <div className={styles.cloud} style={{ top: '32%', right: '12%' }}></div>
      <div className={styles.smallStar} style={{ top: '42%', left: '42%' }} />
      <div className={styles.smallStar} style={{ top: '48%', right: '40%' }} />
      <div
        className={styles.smallStar}
        style={{ bottom: '22%', left: '45%' }}
      />
      <div
        className={styles.smallStar}
        style={{ bottom: '18%', right: '42%' }}
      />
      <div className={styles.smallStar} style={{ top: '55%', left: '50%' }} />
      <div
        className={styles.smallStar}
        style={{ bottom: '12%', left: '52%' }}
      />
      <div className={styles.smallStar} style={{ top: '68%', right: '48%' }} />
      <div className={styles.smallStar} style={{ top: '45%', left: '55%' }} />
      <div
        className={styles.smallStar}
        style={{ bottom: '28%', right: '50%' }}
      />
      <div className={styles.smallStar} style={{ top: '72%', left: '48%' }} />
      <div className={styles.smallStar} style={{ top: '56%', left: '30%' }} />
      <div className={styles.smallStar} style={{ top: '35%', right: '18%' }} />
      <div className={styles.smallStar} style={{ top: '70%', left: '35%' }} />
      <div className={styles.smallStar} style={{ top: '38%', right: '35%' }} />
      <div className={styles.smallStar} style={{ top: '60%', left: '15%' }} />
      <div className={styles.smallStar} style={{ top: '60%', right: '50%' }} />
      <div className={styles.smallStar} style={{ top: '80%', left: '28%' }} />
      <div className={styles.smallStar} style={{ top: '43%', right: '28%' }} />
      <div className={styles.smallStar} style={{ top: '80%', left: '40%' }} />
      <div className={styles.smallStar} style={{ top: '45%', right: '40%' }} />
      <div className={styles.smallStar} style={{ top: '71%', left: '18%' }} />
      <div className={styles.smallStar} style={{ top: '48%', right: '22%' }} />
      <div className={styles.smallStar} style={{ top: '50%', left: '32%' }} />
      <div className={styles.smallStar} style={{ top: '50%', right: '32%' }} />
      <div className={styles.smallStar} style={{ top: '52%', left: '22%' }} />
      <div className={styles.smallStar} style={{ top: '52%', right: '38%' }} />
    </div>
  );
};
