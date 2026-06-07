import { useCallback, useState } from 'react';

import useOutsideClick from '@/shared/hooks/useOutsideClick';

import { type TooltipProps } from './Tooltip.props';

import styles from './Tooltip.module.css';

export const Tooltip = (props: TooltipProps) => {
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

  const handleClick = () => {
    if (isEnabled) {
      setIsVisible((prev) => !prev);
    }
  };

  const closeTooltip = useCallback(() => {
    setIsVisible(false);
  }, []);

  const outsideClickRef = useOutsideClick<HTMLDivElement>(closeTooltip);

  const setRefs = (node: HTMLDivElement | null) => {
    outsideClickRef.current = node;

    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  return (
    <div
      className={`${styles['tooltip-wrapper']} ${className}`}
      style={style}
      ref={setRefs}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
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
