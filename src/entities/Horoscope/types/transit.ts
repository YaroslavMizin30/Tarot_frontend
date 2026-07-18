import type { AspectType, BodyId, PlanetId } from '.';
import type { NatalChart } from './chart';

export type TransitAngleId = 'asc' | 'mc' | 'ic' | 'dc';
export type TransitTargetId = PlanetId | TransitAngleId;
export type TransitPhase = 'applying' | 'separating' | 'stationary';

export interface PersonalTransit {
  id: string;
  transitBody: BodyId;
  transitPosition: number;
  natalTarget: TransitTargetId;
  natalTargetPosition: number;
  natalTargetSign?: string | null;
  natalTargetHouse?: number | null;
  targetType: 'planet' | 'angle';
  aspect: AspectType;
  exactAngle: number;
  orb: number;
  phase: TransitPhase;
  natalHouse: number | null;
  score: number;
}

export interface PersonalTransitSummary {
  timestamp: string;
  highlights: PersonalTransit[];
  all: PersonalTransit[];
  total: number;
}

export interface PersonalTransitInput {
  chart: NatalChart;
  ephemeris: import('.').EphemerisData;
  limit?: number;
}
