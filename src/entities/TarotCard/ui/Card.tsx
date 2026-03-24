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
    isInverted,
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
      className={`${styles.container} ${canTurnOver ? styles.clickable : ''} ${className} ${isInverted ? styles.inverted : ''}`}
      onClick={handleCardClick}
      style={style}
    >
      <div className={`${styles.inner} ${isReversed ? styles.reversed : ''}`}>
        <div className={styles.back}></div>

        <div className={`${styles.front}`}>
          <div className={styles['image-wrapper']}>
            <img
              className={`${styles.image} ${isInverted && !isReversed ? styles.reversed : ''}`}
              src={`/src/shared/assets/images/card/${name}.png`}
            />
          </div>

          <div
            className={`${styles.footer} ${isInverted && !isReversed ? styles.reversed : ''}`}
          >
            <h2 className={styles.name}>{localizedName}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};
