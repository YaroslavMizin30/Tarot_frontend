import React, { type FC } from 'react';

import useLocales from '@/shared/hooks/useLocales';

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

  const { i18n } = useLocales();

  return (
    <div
      className={styles.container}
      style={{ maxHeight: `${maxHeight}${maxHeightMeasure}` }}
    >
      {title && <h3 className={styles.title}>{i18n(title)}</h3>}

      <div className={`${styles.text} custom-scrollbar ${className}`}>
        {paragraphs.map((paragraph) => {
          return <span key={paragraph}>{i18n(paragraph)}</span>;
        })}
      </div>

      {children}
    </div>
  );
};
