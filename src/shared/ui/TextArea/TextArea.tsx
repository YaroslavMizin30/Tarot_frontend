import { forwardRef } from 'react';

import type { TextAreaProps } from './TextArea.props';

import styles from './TextArea.module.css';

const TextArea = forwardRef<
  HTMLTextAreaElement,
  TextAreaProps
>((props, ref) => {
  const { className, wrapperClassName, errorMessage, ...restProps } = props;

  return (
    <div className={`${styles.wrapper} ${wrapperClassName}`}>
      <textarea
        ref={ref}
        className={`${styles.input} ${className} ${errorMessage && styles['input-error']}`}
        {...restProps}
      />

      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
