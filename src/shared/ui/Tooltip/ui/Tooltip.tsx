import { type FC } from 'react';

import { type TooltipProps } from './Tooltip.props';

import styles from './Tooltip.module.css';

export const Tooltip: FC<TooltipProps> = (props) => {
  const {
    children,
    content,
    position = 'right',
    isVisible = false,
    className = '',
    tooltipClassName = '',
    style,
  } = props;

  return (
    <div className={`${styles['tooltip-wrapper']} ${className}`} style={style}>
      {children}

      {isVisible && content && (
        <div
          className={`${styles['tooltip']} ${styles[`tooltip--${position}`]} ${tooltipClassName}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};
