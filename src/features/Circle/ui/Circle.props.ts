import type {
  BodyName,
  AstroBody,
  PlanetId,
  ZodiacSignId,
} from '@/entities/Horoscope/types';

type House =
  | 'house_1'
  | 'house_2'
  | 'house_3'
  | 'house_4'
  | 'house_5'
  | 'house_6'
  | 'house_7'
  | 'house_8'
  | 'house_9'
  | 'house_10'
  | 'house_11'
  | 'house_12';

export interface CircleProps {
  bodies: Partial<Record<BodyName | PlanetId, AstroBody>>;
  firstHouseSignDegree?: number;
  className?: string;
  highlightedBodies?: Partial<Record<PlanetId | ZodiacSignId | House, boolean>>;
}
