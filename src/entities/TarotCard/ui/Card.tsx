import { forwardRef, useState } from 'react';
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
      hasBackShimmer = false,
      size = 'l',
    } = props;

    const [isLoaded, setIsLoaded] = useState(!hasLoadingState);
    const isCardReversed = Boolean(isReversed);

    const handleImageLoad = () => {
      if (hasLoadingState) {
        setIsLoaded(true);
      }
    };

    const handleCardClick = () => {
      if (canTurnOver && isCardReversed) {
        onClick();
      }
    };

    return (
      <div
        className={`${styles.container} ${canTurnOver ? styles.clickable : ''} ${className} ${styles[`container-${size}`]}`}
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
          <div className={cx('back', size, { backShimmer: hasBackShimmer })} />

          <div className={cx('front', size, { inverted: isInverted })}>
            <div className={styles['image-wrapper']}>
              <img
                className={`${styles.image} ${styles[`image-${size}`]}`}
                src={`/assets/images/card/${name}.png`}
                onLoad={handleImageLoad}
              />
            </div>

            <div className={styles.footer}>
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
