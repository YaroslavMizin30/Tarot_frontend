import type { BodyName, AstroBody, PlanetId } from '@/entities/Horoscope/types';

export interface CircleProps {
  bodies: Partial<Record<BodyName | PlanetId, AstroBody>>;
  firstHouseSignDegree?: number;
  className?: string;
}
