import { useState, type FC } from 'react';

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
    isReversed,
  } = props;

  const [isCardReversed, setIsReversed] = useState(isReversed);

  const handleCardClick = () => {
    if (canTurnOver && isCardReversed) {
      setIsReversed(!isCardReversed);

      onClick();
    }
  };

  return (
    <div
      className={`${styles.container} ${canTurnOver ? styles.clickable : ''} ${className} ${isInverted ? styles.inverted : ''}`}
      onClick={handleCardClick}
      style={style}
    >
      <div className={`${styles.inner} ${isCardReversed ? styles.reversed : ''}`}>
        <div className={styles.back}></div>

        <div className={`${styles.front}`}>
          <div className={styles['image-wrapper']}>
            <img
              className={`${styles.image} ${isInverted && !isCardReversed ? styles.reversed : ''}`}
              src={`assets/images/card/${name}.png`}
            />
          </div>

          <div
            className={`${styles.footer} ${isInverted && !isCardReversed ? styles.reversed : ''}`}
          >
            <h2 className={styles.name}>{localizedName}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};
