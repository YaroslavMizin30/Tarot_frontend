import type { PlanetId, ZodiacSign } from '@/entities/Horoscope';
import type { Aspect } from '@/entities/Horoscope/types/chart';

interface Item {
  title: string;
  body: string;
  tags: string[];
}

export interface AccordionProps {
  sections: {
    core_self: Item[];
    mind: Item[];
    work_path: Item[];
    social_collective: Item[];
    love_relating: Item[];
    karmic_healing: Item[];
  };
  onHighLight: (
    isHighLighter: boolean,
    body: PlanetId | ZodiacSign | null | string,
  ) => void;
  selectedPlanet?: PlanetId | null;
  onSelectPlanet?: (planet: PlanetId | null) => void;
  aspects?: Aspect[];
  selectedAspectKey?: string | null;
  onSelectAspect?: (aspectKey: string | null) => void;
}

export interface SectionProps {
  onClick: () => void;
  items: Item[];
  name: string;
  isOpened: boolean;
  className?: string;
  onHighLight: (
    isHighLighter: boolean,
    body: PlanetId | ZodiacSign | null | string,
  ) => void;
  selectedPlanet?: PlanetId | null;
  onSelectPlanet?: (planet: PlanetId | null) => void;
  aspects?: Aspect[];
  selectedAspectKey?: string | null;
  onSelectAspect?: (aspectKey: string | null) => void;
}
