import { type Planet, type ZodiacSign } from '@/entities/Horoscope';

export interface CircleProps {
  positions: Record<Partial<Planet>, ZodiacSign | undefined>;
  className?: string;
}
