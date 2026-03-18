import React, { type FC } from 'react';

import type { InputProps } from './Input.props';

import styles from './Input.module.css';

export const Input: FC<InputProps> = () => {
  return <input className={styles.input} />;
};
