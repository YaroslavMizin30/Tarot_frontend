import type { PlanetId, PlanetName, ZodiacSignId, AspectType } from '.';

export interface SubjectLocation {
  city: string;
  lat: number;
  lng: number;
  timezone: string;
}

export interface SubjectSettings {
  house_system: string;
  julian_day: number;
  julian_day_tt: number;
  delta_t_days: number;
  delta_t_seconds: number;
  zodiac_type: string;
  time_known: boolean;
}

export interface Subject {
  name: string;
  datetime: string; // ISO 8601
  location: SubjectLocation;
  settings: SubjectSettings;
}

export type InterpretationCategory = 'planet_sign' | 'planet_house' | 'aspect';

export type InterpretationSection =
  | 'core_self'
  | 'mind'
  | 'love_relating'
  | 'work_path'
  | 'social_collective'
  | 'karmic_healing';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface Planet {
  id: PlanetId;
  name: PlanetName;
  sign: string; // Сокращение знака ("Tau", "Cap")
  sign_id: ZodiacSignId;
  pos: number; // Позиция в знаке (0-30°)
  abs_pos: number; // Абсолютная позиция (0-360°)
  retrograde: boolean;
  house: number; // Дом (1-12)
  declination_deg: number;
  variant?: string; // Для North Node ("mean")
}

export interface Aspect {
  p1: PlanetId;
  p2: PlanetId;
  type: AspectType;
  orb: number; // Орбис в градусах
  deg: number; // Точный угол (0, 60, 90, 120, 180)
  is_major: boolean;
  is_applying: boolean;
}

export interface AspectsSummary {
  total: number;
  major: number;
  minor: number;
  by_type: {
    trine: number;
    conjunction: number;
    opposition: number;
    sextile: number;
    square: number;
  };
}

export interface House {
  house: number; // 1-12
  name: string; // "1", "2", и т.д.
  sign: string; // Сокращение знака
  sign_id: ZodiacSignId;
  pos: number; // Позиция в знаке
  abs_pos: number; // Абсолютная позиция
}

export interface Angles {
  asc: number; // Ascendant
  mc: number; // Midheaven
  ic: number; // Imum Coeli
  dc: number; // Descendant
  vertex: number;
}

export interface AngleDetail {
  sign: string;
  sign_id: ZodiacSignId;
  pos: number;
  abs_pos: number;
  house: number;
}

export interface AnglesDetails {
  asc: AngleDetail;
  mc: AngleDetail;
  ic: AngleDetail;
  dc: AngleDetail;
  vertex: AngleDetail;
}

export interface Stellium {
  sign_id?: ZodiacSignId;
  house?: number;
  count: number;
  bodies: PlanetId[];
}

export interface Stelliums {
  threshold: number;
  signs: Stellium[];
  houses: Stellium[];
  total: number;
}

export interface InterpretationItem {
  id: string; // UUID
  key: string; // Например: "planet.sun.sign.taurus"
  category: InterpretationCategory;
  title: string;
  body: string;
  tone: string;
  tags: string[];
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

export interface InterpretationSections {
  core_self: InterpretationItem[];
  mind: InterpretationItem[];
  love_relating: InterpretationItem[];
  work_path: InterpretationItem[];
  social_collective: InterpretationItem[];
  karmic_healing: InterpretationItem[];
}

export interface InterpretationMetadata {
  key_count: number;
  found_count: number;
  missing_keys: string[];
}

export interface Interpretation {
  metadata: InterpretationMetadata;
  sections: InterpretationSections;
}

export interface PlacementIndex {
  planet: PlanetId;
  key: string;
  type: 'sign' | 'house';
  title: string;
  content: string;
}

export interface AspectIndex {
  p1: PlanetId;
  p2: PlanetId;
  type: AspectType;
  key: string;
  title: string;
  content: string;
}

export interface ChartIndex {
  placements: PlacementIndex[];
  aspects: AspectIndex[];
}

export interface NatalChart {
  subject: Subject;
  planets: Planet[];
  aspects: Aspect[];
  aspects_summary: AspectsSummary;
  confidence: {
    houses: ConfidenceLevel;
    angles: ConfidenceLevel;
    overall: ConfidenceLevel;
  };
  houses: House[];
  angles: Angles;
  angles_details: AnglesDetails;
  stelliums: Stelliums;
  interpretation: Interpretation;
  index: ChartIndex;
}
