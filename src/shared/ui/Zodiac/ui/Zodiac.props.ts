import type { Sign } from '../types/zodiac';

export interface ZodiacProps {
  sign?: Sign;
  className?: string;
  type?: 'big' | 'small';
  isHighlighted?: boolean;
}
