import React, { useState, type FC } from 'react';

import type { TarotCardProps } from '../model/types';
import { Russian } from '../model/enums';

import styles from './Card.module.css';

export const TarotCard: FC<TarotCardProps> = (props) => {
  const { name, canTurnOver = true, onClick = () => undefined } = props;

  const [isReversed, setIsReversed] = useState(false);

  const handleCardClick = () => {
    if (canTurnOver) {
      setIsReversed(!isReversed);
    }

    onClick();
  };

  return (
    <div
      className={`${styles.container} ${canTurnOver ? styles.clickable : ''}`}
      onClick={handleCardClick}
    >
      <div className={`${styles.inner} ${isReversed ? styles.reversed : ''}`}>
        <div className={styles.back}></div>

        <div className={styles.front}>
          <img
            className={styles.image}
            src={new URL(`../assets/${name}.png`, import.meta.url).href}
          />

          <div className={styles.footer}>
            <h2 className={styles.name}>{Russian[name]}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};
