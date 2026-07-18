import type { Planet } from '@/entities/Horoscope/types/chart';

import { capitalize } from '@/shared/utils';

export const PLANETS = [
  'Sun',
  'Moon',
  'Mercury',
  'Venus',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
  'Pluto',
  'North Node',
  'Chiron',
  'Lilith',
] as const;

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
  //@ts-expect-error types
  return planets.filter((p) => PLANETS.includes(capitalize(p))) as Planet['id'][];
};
