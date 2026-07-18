import type { Planet } from '@/entities/Horoscope/types/chart';

import { capitalize } from '@/shared/utils';

const PLANET_BY_TAG: Record<string, Planet['id']> = {
  sun: 'sun',
  moon: 'moon',
  mercury: 'mercury',
  venus: 'venus',
  mars: 'mars',
  jupiter: 'jupiter',
  saturn: 'saturn',
  uranus: 'uranus',
  neptune: 'neptune',
  pluto: 'pluto',
  north_node: 'north_node',
  chiron: 'chiron',
  lilith: 'lilith',
};

const normalizePlanetTag = (value: string) => value
  .trim()
  .toLowerCase()
  .replace(/[\s-]+/g, '_');

export const getBodies = (planets: Planet[]) => {
  const planetObj = {};

  planets.forEach((planet) => {
    const { id, sign_id, pos } = planet;

    //@ts-expect-error types
    planetObj[capitalize(id)] = { signId: sign_id, degreeInSign: pos };
  });

  return planetObj;
};

export const findPlanets = (planets: string[]) => {
  return planets
    .map((planet) => PLANET_BY_TAG[normalizePlanetTag(planet)])
    .filter((planet): planet is Planet['id'] => Boolean(planet));
};
