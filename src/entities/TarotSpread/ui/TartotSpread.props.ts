import { type CSSProperties } from 'react';

export interface TarotSpreadProps {
  onSpreadTypeChange: (
    data: Array<CSSProperties & { index?: number; description?: string }>,
  ) => void;
}
