import type { CSSProperties } from 'react';

import type { MoonPhaseName } from '../../types';

export interface MoonProps {
  phase: MoonPhaseName;
  size: 's' | 'l';
  className?: string;
  style?: CSSProperties;
}
