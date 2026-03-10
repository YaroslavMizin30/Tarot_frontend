import React, { useState, type FC } from 'react';

import type { TarotCardProps } from './Card.props';

import styles from './Card.module.css';

export const TarotCard: FC<TarotCardProps> = (props) => {
  const {
    name,
    canTurnOver = false,
    onClick = () => undefined,
    localizedName = '',
    className = '',
    style = {},
  } = props;

  const [isReversed, setIsReversed] = useState(true);

  const handleCardClick = () => {
    if (canTurnOver && isReversed) {
      setIsReversed(!isReversed);

      onClick();
    }
  };

  return (
    <div
      className={`${styles.container} ${canTurnOver ? styles.clickable : ''} ${className}`}
      onClick={handleCardClick}
      style={style}
    >
      <div className={`${styles.inner} ${isReversed ? styles.reversed : ''}`}>
        <div className={styles.back}></div>

        <div className={styles.front}>
          <div className={styles['image-wrapper']}>
            <img
              className={styles.image}
              src={
                new URL(
                  `/src/shared/assets/images/card/${name}.png`,
                  import.meta.url,
                ).href
              }
            />
          </div>

          <div className={styles.footer}>
            <h2 className={styles.name}>{localizedName}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};
