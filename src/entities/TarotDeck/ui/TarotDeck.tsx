import { type FC } from 'react';
import classNames from 'classnames/bind';

import Spinner from '@/shared/ui/Spinner';

import { type TarotDeckProps } from './TarotDeck.props';

import styles from './TarotDeck.module.css';

const cx = classNames.bind(styles);

export const TarotDeck: FC<TarotDeckProps> = (props) => {
  const { children, className = '', isReading, onReadEnd, ...rest } = props;

  const handleAnimationEnd = () => {
    onReadEnd();
  };

  const theme = document.documentElement.getAttribute('data-theme') as
    | 'standard'
    | 'gray'
    | 'bronze';

  return (
    <div
      className={`${cx('deck', { ['deck-reading']: isReading, ['deck-gray']: theme === 'gray', ['deck-bronze']: theme === 'bronze' })} ${className}`}
      onAnimationEnd={handleAnimationEnd}
      {...rest}
    >
      {isReading && <Spinner className={styles.spinner} />}

      {children}
    </div>
  );
};
