import { type ReactNode, type CSSProperties } from 'react';

export interface TooltipProps {
  children: ReactNode;
  content?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  isVisible: boolean;
  className?: string;
  tooltipClassName?: string;
  style?: CSSProperties;
}
