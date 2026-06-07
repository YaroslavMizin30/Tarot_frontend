import { type ReactNode, type CSSProperties, type Ref } from 'react';

export interface TooltipProps {
  children: ReactNode;
  content?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  isEnabled?: boolean;
  className?: string;
  tooltipClassName?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
}
