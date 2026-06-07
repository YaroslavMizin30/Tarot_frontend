import { useState, type FC } from 'react';

import { type TooltipProps } from './Tooltip.props';

import styles from './Tooltip.module.css';

export const Tooltip: FC<TooltipProps> = (props) => {
  const {
    children,
    content,
    position = 'right',
    className = '',
    tooltipClassName = '',
    style,
    ref,
    isEnabled = true,
  } = props;

  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    if (isEnabled) {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (isEnabled) {
      setIsVisible(false);
    }
  };

  return (
    <div
      className={`${styles['tooltip-wrapper']} ${className}`}
      style={style}
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isVisible && content && isEnabled && (
        <div
          className={`${styles['tooltip']} ${styles[`tooltip--${position}`]} ${tooltipClassName}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};
