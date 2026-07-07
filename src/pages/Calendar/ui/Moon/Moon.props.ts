import type { CSSProperties } from 'react';

export interface MoonProps {
  phase: string;
  size: 's' | 'l';
  style?: CSSProperties;
}
