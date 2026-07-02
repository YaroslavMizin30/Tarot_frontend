import type { BodyName, AstroBody } from '@/entities/Horoscope/types';

export interface CircleProps {
  bodies: Partial<Record<BodyName, AstroBody>>;
  className?: string;
}
