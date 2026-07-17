import type { CSSProperties } from 'react';

import type { MoonPhaseName } from '../../types';

export interface MoonProps {
  phase: MoonPhaseName;
  size: 's' | 'm' | 'l';
  phaseAngleDeg?: number;
  isWaxing?: boolean;
  className?: string;
  style?: CSSProperties;
}
