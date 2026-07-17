import { forwardRef, useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import type { TarotCardProps } from './Card.props';

import GlassLoader from '@/shared/ui/GlassLoader';

// import { isShortSingleWord } from '../lib/isShortSingleWord';

import styles from './Card.module.css';

const cx = classNames.bind(styles);

export const TarotCard = forwardRef<HTMLDivElement, TarotCardProps>(
  (props, ref) => {
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
      size = 'l',
    } = props;

    const [isCardReversed, setIsReversed] = useState(isReversed);
    const [isLoaded, setIsLoaded] = useState(!hasLoadingState);

    useEffect(() => {
      setIsReversed(isReversed);
    }, [isReversed]);

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
        className={`${styles.container} ${canTurnOver ? styles.clickable : ''} ${className} ${isInverted ? styles.inverted : ''} ${styles[`container-${size}`]}`}
        onClick={handleCardClick}
        style={style}
        ref={ref}
      >
        <div
          className={`${styles.inner} ${isCardReversed ? styles.reversed : ''}`}
          style={{
            width: isLoaded ? undefined : '0px',
            height: isLoaded ? undefined : '0px',
          }}
        >
          <div className={cx('back', size)} />

          <div className={cx('front', size)}>
            <div className={styles['image-wrapper']}>
              <img
                className={`${styles.image} ${isInverted && !isCardReversed ? styles.reversed : ''} ${styles[`image-${size}`]}`}
                src={`/assets/images/card/${name}.png`}
                onLoad={handleImageLoad}
              />
            </div>

            <div
              className={cx('footer', {
                reversed: isInverted && !isCardReversed,
              })}
            >
              <h2 className={`${styles.name} ${styles[`name-${size}`]}`}>
                {localizedName}
              </h2>
            </div>
          </div>
        </div>

        {!isLoaded && <GlassLoader />}
      </div>
    );
  },
);
