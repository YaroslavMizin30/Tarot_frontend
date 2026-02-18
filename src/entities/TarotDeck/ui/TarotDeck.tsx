import { useState, type FC } from 'react';

import Spinner from '@/shared/ui/Spinner';

import { type TarotDeckProps } from './TarotDeck.props';

import styles from './TarotDeck.module.css';

export const TarotDeck: FC<TarotDeckProps> = (props) => {
  const { children, ...rest } = props;

  const [isReading, setIsReding] = useState(false);

  const handleClick = () => {
    setIsReding(true);
  };

  const handleAnimationEnd = () => {
    setIsReding(false);
  };

  return (
    <div
      className={`${styles.deck} ${isReading ? styles['deck-reading'] : ''}`}
      onClick={handleClick}
      onAnimationEnd={handleAnimationEnd}
      {...rest}
    >
      {isReading && <Spinner className={styles.spinner} />}

      {children}
    </div>
  );
};
