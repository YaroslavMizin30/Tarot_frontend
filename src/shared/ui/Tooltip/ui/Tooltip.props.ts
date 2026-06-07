import { type ReactNode, type CSSProperties, type RefObject } from 'react';

export interface TooltipProps {
  children: ReactNode;
  content?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  isEnabled?: boolean;
  className?: string;
  tooltipClassName?: string;
  style?: CSSProperties;
  ref?: RefObject<HTMLDivElement | null>;
}
