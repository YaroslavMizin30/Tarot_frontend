import { type FC } from 'react';

import Spinner from '@/shared/ui/Spinner';

import { type TarotDeckProps } from './TarotDeck.props';

import styles from './TarotDeck.module.css';

export const TarotDeck: FC<TarotDeckProps> = (props) => {
  const { children, className = '', isReading, onReadEnd, ...rest } = props;

  const handleAnimationEnd = () => {
    onReadEnd();
  };

  return (
    <div
      className={`${styles.deck} ${isReading ? styles['deck-reading'] : ''} ${className}`}
      onAnimationEnd={handleAnimationEnd}
      {...rest}
    >
      {isReading && <Spinner className={styles.spinner} />}

      {children}
    </div>
  );
};
