import { type FC } from 'react';

import styles from './Spinner.module.css';
import type { SpinnerProps } from './Spinner.props';

import SpinnerIcon from '@/shared/assets/svg/common/spinner.svg';

export const Spinner: FC<SpinnerProps> = (props) => {
  const { className = '', size = 's' } = props;

  return (
    <SpinnerIcon className={`${styles.spinner} ${styles[size]} ${className}`} />
  );
};
