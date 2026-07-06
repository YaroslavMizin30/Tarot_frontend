import type { PlanetId, ZodiacSign } from '@/entities/Horoscope';

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
}
