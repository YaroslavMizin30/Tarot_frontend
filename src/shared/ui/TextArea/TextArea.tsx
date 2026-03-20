import React, { type FC } from 'react';

import type { TextAreaProps } from './TextArea.props';

import styles from './TextArea.module.css';

const TextArea: FC<TextAreaProps> = (props) => {
  const { className, ...restProps } = props;

  return <textarea className={`${styles.input} ${className}`} {...restProps} />;
};

export default TextArea;
