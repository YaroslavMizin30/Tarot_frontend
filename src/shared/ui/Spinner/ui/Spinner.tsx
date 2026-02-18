import React, { type FC } from 'react';

import styles from './Spinner.module.css';
import type { SpinnerProps } from './Spinner.props';

export const Spinner: FC<SpinnerProps> = (props) => {
  const { className = '', } = props;

  return <div className={`${styles.spinner} ${className}`}></div>;
};
