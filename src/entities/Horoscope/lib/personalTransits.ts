import type {
  AspectType,
  AstroBody,
  BodyId,
  EphemerisData,
  PlanetId,
} from '../types';
import type { NatalChart } from '../types/chart';
import type {
  PersonalTransit,
  PersonalTransitInput,
  PersonalTransitSummary,
  TransitAngleId,
  TransitPhase,
  TransitTargetId,
} from '../types/transit';

interface AspectRule {
  type: AspectType;
  angle: number;
  orb: number;
  weight: number;
}

interface NatalTarget {
  id: TransitTargetId;
  type: 'planet' | 'angle';
  absPos: number;
}

const ASPECT_RULES: AspectRule[] = [
  { type: 'conjunction', angle: 0, orb: 6, weight: 30 },
  { type: 'opposition', angle: 180, orb: 6, weight: 28 },
  { type: 'square', angle: 90, orb: 5, weight: 26 },
  { type: 'trine', angle: 120, orb: 5, weight: 22 },
  { type: 'sextile', angle: 60, orb: 4, weight: 18 },
];

const TARGET_WEIGHTS: Partial<Record<TransitTargetId, number>> = {
  asc: 24,
  mc: 24,
  sun: 22,
  moon: 22,
  dc: 18,
  ic: 18,
  mercury: 12,
  venus: 12,
  mars: 12,
};

const TRANSIT_WEIGHTS: Partial<Record<BodyId, number>> = {
  pluto: 18,
  neptune: 17,
  uranus: 17,
  saturn: 16,
  jupiter: 13,
  mars: 9,
  venus: 7,
  mercury: 7,
  sun: 6,
  moon: 2,
};

const normalizeDegrees = (value: number) => ((value % 360) + 360) % 360;

export const getAngularDistance = (first: number, second: number) => {
  const difference = Math.abs(normalizeDegrees(first) - normalizeDegrees(second));

  return Math.min(difference, 360 - difference);
};

const getAspectRule = (distance: number, transitBody: BodyId) => {
  const moonOrbMultiplier = transitBody === 'moon' ? 0.6 : 1;

  return ASPECT_RULES.map((rule) => ({
    rule,
    orb: Math.abs(distance - rule.angle),
    allowedOrb: rule.orb * moonOrbMultiplier,
  }))
    .filter(({ orb, allowedOrb }) => orb <= allowedOrb)
    .sort((first, second) => first.orb - second.orb)[0];
};

const getTransitPhase = (
  body: AstroBody,
  targetPosition: number,
  aspectAngle: number,
  currentOrb: number,
): TransitPhase => {
  if (body.isStationary || Math.abs(body.speed) < 0.005) return 'stationary';

  const projectedPosition = normalizeDegrees(body.absPos + body.speed * 0.25);
  const projectedDistance = getAngularDistance(projectedPosition, targetPosition);
  const projectedOrb = Math.abs(projectedDistance - aspectAngle);

  return projectedOrb < currentOrb ? 'applying' : 'separating';
};

export const getNatalHouse = (position: number, chart: NatalChart) => {
  const houses = [...chart.houses].sort((first, second) => first.house - second.house);
  if (houses.length !== 12) return null;

  const normalizedPosition = normalizeDegrees(position);

  for (let index = 0; index < houses.length; index += 1) {
    const current = houses[index];
    const next = houses[(index + 1) % houses.length];
    if (!current || !next) continue;

    const span = normalizeDegrees(next.abs_pos - current.abs_pos);
    const offset = normalizeDegrees(normalizedPosition - current.abs_pos);

    if (offset < span || (index === houses.length - 1 && offset === span)) {
      return current.house;
    }
  }

  return null;
};

const getNatalTargets = (chart: NatalChart): NatalTarget[] => {
  const planetTargets: NatalTarget[] = chart.planets.map((planet) => ({
    id: planet.id,
    type: 'planet',
    absPos: planet.abs_pos,
  }));
  const angleIds: TransitAngleId[] = ['asc', 'mc', 'ic', 'dc'];
  const angleTargets: NatalTarget[] = angleIds.map((angle) => ({
    id: angle,
    type: 'angle',
    absPos: chart.angles[angle],
  }));

  return [...planetTargets, ...angleTargets];
};

const calculateScore = (
  rule: AspectRule,
  orb: number,
  allowedOrb: number,
  target: TransitTargetId,
  body: BodyId,
  phase: TransitPhase,
) => {
  const precision = Math.max(0, 1 - orb / allowedOrb) * 25;
  const phaseWeight = phase === 'applying' ? 8 : phase === 'stationary' ? 6 : 0;

  return Math.round(
    rule.weight +
    precision +
    (TARGET_WEIGHTS[target] ?? 6) +
    (TRANSIT_WEIGHTS[body] ?? 5) +
    phaseWeight,
  );
};

const getTransitBodies = (ephemeris: EphemerisData) =>
  Object.values(ephemeris.bodies).filter((body): body is AstroBody => Boolean(body));

export const calculatePersonalTransits = ({
  chart,
  ephemeris,
  limit = 5,
}: PersonalTransitInput): PersonalTransitSummary => {
  const targets = getNatalTargets(chart);
  const transits: PersonalTransit[] = [];

  getTransitBodies(ephemeris).forEach((body) => {
    targets.forEach((target) => {
      const distance = getAngularDistance(body.absPos, target.absPos);
      const match = getAspectRule(distance, body.id);
      if (!match) return;

      const phase = getTransitPhase(
        body,
        target.absPos,
        match.rule.angle,
        match.orb,
      );

      transits.push({
        id: `${body.id}:${target.id}:${match.rule.type}`,
        transitBody: body.id,
        transitPosition: body.absPos,
        natalTarget: target.id,
        natalTargetPosition: target.absPos,
        targetType: target.type,
        aspect: match.rule.type,
        exactAngle: match.rule.angle,
        orb: Number(match.orb.toFixed(2)),
        phase,
        natalHouse: getNatalHouse(body.absPos, chart),
        score: calculateScore(
          match.rule,
          match.orb,
          match.allowedOrb,
          target.id,
          body.id,
          phase,
        ),
      });
    });
  });

  const sorted = transits.sort(
    (first, second) => second.score - first.score || first.orb - second.orb,
  );
  const bodyCounts = new Map<BodyId, number>();
  const highlights = sorted.filter((transit) => {
    const count = bodyCounts.get(transit.transitBody) ?? 0;
    if (count >= 2) return false;
    bodyCounts.set(transit.transitBody, count + 1);

    return true;
  }).slice(0, limit);

  return {
    timestamp: ephemeris.timestamp,
    highlights,
    all: sorted,
    total: transits.length,
  };
};

export const isPlanetTransitTarget = (
  target: TransitTargetId,
): target is PlanetId => !(['asc', 'mc', 'ic', 'dc'] as string[]).includes(target);
