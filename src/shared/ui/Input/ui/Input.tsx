import React, { type FC } from 'react';

import type { InputProps } from './Input.props';

import styles from './Input.module.css';

export const Input: FC<InputProps> = (props) => {
  const { className = '', ...restProps } = props;

  return <input className={`${styles.input} ${className}`} {...restProps} />;
};
