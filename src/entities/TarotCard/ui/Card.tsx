import { useState, type FC } from 'react';

import type { TarotCardProps } from './Card.props';

import GlassLoader from '@/shared/ui/GlassLoader';

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
    hasLoadingState = false,
  } = props;

  const [isCardReversed, setIsReversed] = useState(isReversed);
  const [isLoaded, setIsLoaded] = useState(!hasLoadingState);

  const handleImageLoad = () => {
    if (hasLoadingState) {
      setIsLoaded(true);
    }
  };

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
      <div
        className={`${styles.inner} ${isCardReversed ? styles.reversed : ''}`}
        style={{
          width: isLoaded ? undefined : '0px',
          height: isLoaded ? undefined : '0px',
        }}
      >
        <div className={styles.back}></div>

        <div className={`${styles.front}`}>
          <div className={styles['image-wrapper']}>
            <img
              className={`${styles.image} ${isInverted && !isCardReversed ? styles.reversed : ''}`}
              src={`/assets/images/card/${name}.png`}
              onLoad={handleImageLoad}
            />
          </div>

          <div
            className={`${styles.footer} ${isInverted && !isCardReversed ? styles.reversed : ''}`}
          >
            <h2 className={styles.name}>{localizedName}</h2>
          </div>
        </div>
      </div>

      {!isLoaded && <GlassLoader />}
    </div>
  );
};
