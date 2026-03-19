import { type CSSProperties, type ReactNode } from 'react';

export interface PlaceholderProps {
  style?: CSSProperties;
  index?: number;
  title?: string;
  description?: string;
  tooltipPosition?: 'bottom' | 'top' | 'left' | 'right';
  tooltipStyle?: CSSProperties;
  children?: ReactNode;
}
