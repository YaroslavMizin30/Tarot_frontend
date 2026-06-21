import { useState, type FC } from 'react';
import classNames from 'classnames/bind';

import type { TarotCardProps } from './Card.props';

import GlassLoader from '@/shared/ui/GlassLoader';

import { isShortSingleWord } from '../lib/isShortSingleWord';

import styles from './Card.module.css';

const cx = classNames.bind(styles);

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

  const theme = document.documentElement.getAttribute('data-theme') as
    | 'standard'
    | 'gray'
    | 'bronze';

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
        <div
          className={cx('back', {
            ['back-gray']: theme === 'gray',
            ['back-bronze']: theme === 'bronze',
          })}
        />

        <div
          className={cx('front', {
            ['front-gray']: theme === 'gray',
            ['front-bronze']: theme === 'bronze',
          })}
        >
          <div className={styles['image-wrapper']}>
            <img
              className={`${styles.image} ${isInverted && !isCardReversed ? styles.reversed : ''}`}
              src={`/assets/images/card/${name}.png`}
              onLoad={handleImageLoad}
            />
          </div>

          <div
            className={cx('footer', {
              reversed: isInverted && !isCardReversed,
              ['footer-gray']: theme === 'gray',
              ['footer-bronze']: theme === 'bronze',
            })}
          >
            <h2
              className={`${styles.name} ${isShortSingleWord(localizedName) ? styles.short : ''}`}
            >
              {localizedName}
            </h2>
          </div>
        </div>
      </div>

      {!isLoaded && <GlassLoader />}
    </div>
  );
};
