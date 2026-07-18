import { type CSSProperties, type FC } from 'react';

import Torch from '@/shared/ui/Torch/ui/Torch';

import styles from './TorchComposition.module.css';

const CARDS = [
  { className: styles.cardLeft, rotation: '-17deg' },
  { className: styles.cardLeftBack, rotation: '9deg' },
  { className: styles.cardRightBack, rotation: '-8deg' },
  { className: styles.cardCenter, rotation: '3deg' },
  { className: styles.cardRight, rotation: '16deg' },
  { className: styles.cardNear, rotation: '-5deg' },
] as const;

const CANDLES = [
  { className: styles.candleFarLeft, delay: '-0.7s' },
  { className: styles.candleLeft, delay: '-1.8s' },
  { className: styles.candleCenter, delay: '-0.2s' },
  { className: styles.candleFarRight, delay: '-1.2s' },
  { className: styles.candleRight, delay: '-2.4s' },
  { className: styles.candleNearRight, delay: '-0.9s' },
] as const;

const TorchComposition: FC = () => (
  <div aria-hidden={'true'} className={styles.composition}>
    <div className={styles.vignette} />
    <div className={styles.tableSpot} />

    <div className={styles.tableScene}>
      <div className={styles.tablePlane}>
        <div className={styles.tableLight} />
        {CARDS.map(({ className, rotation }) => (
          <span
            className={`${styles.card} ${className}`}
            key={className}
            style={{ '--card-rotation': rotation } as CSSProperties}
          />
        ))}
      </div>
    </div>

    <div className={styles.candles}>
      {CANDLES.map(({ className, delay }) => (
        <Torch className={className} delay={delay} key={className} />
      ))}
    </div>
  </div>
);

export default TorchComposition;
