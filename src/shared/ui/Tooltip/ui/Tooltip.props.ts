import { type ReactNode } from 'react';

export interface TooltipProps {
  children: ReactNode;
  content?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  isVisible: boolean;
}
