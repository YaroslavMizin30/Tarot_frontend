import React, { type FC } from 'react';

import type { TextContainerProps } from './TextContainer.props';

import styles from './TextContainer.module.css';

export const TextContainer: FC<TextContainerProps> = (props) => {
  const {
    className = '',
    paragraphs,
    maxHeight,
    maxHeightMeasure,
    title,
    children,
  } = props;

  return (
    <div
      className={styles.container}
      style={{ maxHeight: `${maxHeight}${maxHeightMeasure}` }}
    >
      {title && <h3 className={styles.title}>{title}</h3>}

      <div className={`${styles.text} custom-scrollbar ${className}`}>
        {paragraphs.map((paragraph) => {
          return <span>{paragraph}</span>;
        })}
      </div>

      {children}
    </div>
  );
};
