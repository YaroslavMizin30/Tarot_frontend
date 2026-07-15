import { type FC, type ButtonHTMLAttributes } from 'react';

import Arrow from '@/shared/assets/svg/common/deck-arrow.svg';

import styles from './ArrowButton.module.css';

export const ArrowButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (
  props,
) => {
  const { className } = props;

  return (
    <button {...props} className={`${styles.button} ${className}`}>
      <Arrow width={30} height={30} className={styles.arrow} />
    </button>
  );
};
