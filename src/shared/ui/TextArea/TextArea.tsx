import React, { type FC } from 'react';

import type { TextAreaProps } from './TextArea.props';

import styles from './TextArea.module.css';

const TextArea: FC<TextAreaProps> = (props) => {
  const { className, wrapperClassName, errorMessage, ...restProps } = props;

  return (
    <div className={`${styles.wrapper} ${wrapperClassName}`}>
      <textarea
        className={`${styles.input} ${className} ${errorMessage && styles['input-error']}`}
        {...restProps}
      />

      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
    </div>
  );
};

export default TextArea;
