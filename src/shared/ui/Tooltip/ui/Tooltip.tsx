import { type FC } from 'react';

import { type TooltipProps } from './Tooltip.props';

import styles from './Tooltip.module.css';

export const Tooltip: FC<TooltipProps> = (props) => {
  const { children, content, position = 'right', isVisible = false } = props;

  return (
    <div className={styles['tooltip-wrapper']}>
      {children}

      {isVisible && content && (
        <div
          className={`${styles['tooltip']} ${styles[`tooltip--${position}`]}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};
