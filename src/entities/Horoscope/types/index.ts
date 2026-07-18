import type { Sign } from '@/shared/ui/Zodiac';

export interface Horoscope {
  userId: number;
  content: string;
  id: string;
  date: string;
  type: 'daily' | 'weekly' | 'monthly';
  isUserMessage?: boolean;
  sender?: string;
}

export type GeneralHoroscopePeriod = 'daily' | 'weekly' | 'monthly';
export type GeneralHoroscopeLocale = 'ru' | 'en';

export interface GeneralHoroscopeFactor {
  text: string;
  basis: string[];
}

export interface GeneralHoroscopeContent {
  title: string;
  summary: string;
  focus: string;
  supportive_factor: GeneralHoroscopeFactor;
  tension: GeneralHoroscopeFactor;
  practical_step: string;
}

export interface GeneralHoroscopeFact {
  id: string;
  date?: string;
  planets?: string[];
  type?: string;
  orb?: number;
  phase?: 'applying' | 'separating';
  body?: string;
  sign?: string;
  direction?: string;
  name?: string;
}

export interface GeneralHoroscopeFacts {
  significant_aspects?: GeneralHoroscopeFact[];
  stations?: GeneralHoroscopeFact[];
  ingresses?: GeneralHoroscopeFact[];
  moon_phases?: GeneralHoroscopeFact[];
}

export interface GeneralHoroscope {
  id: string;
  sign: ZodiacSignId;
  period: GeneralHoroscopePeriod;
  locale: GeneralHoroscopeLocale;
  period_start: string;
  period_end: string;
  content: GeneralHoroscopeContent;
  facts: GeneralHoroscopeFacts;
  generated_at: string;
}


export type ZodiacSign =
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius'
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces';

export type ZodiacSignId =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

// ==========================================
// Планеты и точки
// ==========================================

export type PlanetId =
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto'
  | 'north_node'
  | 'chiron'
  | 'lilith';

export type PlanetName =
  | 'Sun'
  | 'Moon'
  | 'Mercury'
  | 'Venus'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn'
  | 'Uranus'
  | 'Neptune'
  | 'Pluto'
  | 'North Node'
  | 'Chiron'
  | 'Lilith';


export type MoonPhaseName =
  | 'New Moon'
  | 'Waxing Crescent'
  | 'First Quarter'
  | 'Waxing Gibbous'
  | 'Full Moon'
  | 'Waning Gibbous'
  | 'Last Quarter'
  | 'Waning Crescent';

export type MoonCalendarZodiacSign = ZodiacSign | ZodiacSignId;

export interface MoonCalendarPhase {
  name: MoonPhaseName;
  phaseAngleDeg: number;
  illumination: number;
  ageDays: number;
  distanceKm: number;
  isWaxing: boolean;
}

export interface MoonCalendarNextPhases {
  newMoon: string;
  firstQuarter: string;
  fullMoon: string;
  lastQuarter: string;
}

export interface MoonCalendarZodiac {
  sign: MoonCalendarZodiacSign;
  signId: MoonCalendarZodiacSign;
  degree: number;
  zodiacType: string;
}

export interface MoonCalendarSpecialMoon {
  isSupermoon: boolean;
  isMicromoon: boolean;
  isBlueMoon: boolean;
  isBlackMoon: boolean;
  isHarvestMoon: boolean;
  isHunterMoon: boolean;
  labels: string[];
}

export interface MoonCalendarEclipse {
  isEclipse: boolean;
  isBloodMoon: boolean;
  type: string | null;
  date: string | null;
  visibility: string | null;
  daysFromQuery: number | null;
}

/** Astronomical data stored in the `data` JSON column. */
export interface MoonCalendarData {
  timestamp: string;
  phase: MoonCalendarPhase;
  nextPhases: MoonCalendarNextPhases;
  zodiac: MoonCalendarZodiac;
  specialMoon?: MoonCalendarSpecialMoon;
  eclipse?: MoonCalendarEclipse;
}

/** A normalized API row representing one calendar day. */
export interface MoonCalendarEntry {
  /** Calendar date normalized to `yyyy-mm-dd`. */
  date: string;
  data: MoonCalendarData;
}

export type ZodiacType = 'tropical' | 'sidereal' | 'Tropical' | 'Sidereal';

export type BodyName =
  | 'Sun'
  | 'Moon'
  | 'Mercury'
  | 'Venus'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn'
  | 'Uranus'
  | 'Neptune'
  | 'Pluto'
  | 'North Node'
  | 'South Node'
  | 'Chiron'
  | 'Lilith';

export type BodyId =
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto'
  | 'north_node'
  | 'south_node'
  | 'chiron'
  | 'lilith';

export type AspectType =
  | 'conjunction'
  | 'opposition'
  | 'trine'
  | 'square'
  | 'sextile'
  | 'quincunx'
  | 'semisextile';

export type MotionState = 'direct' | 'retrograde' | 'stationary';

export interface AstroBody {
  id: BodyId;
  name: BodyName;
  sign: ZodiacSign;
  signAbbr: string; // Сокращение знака ("Pis", "Leo")
  signId: ZodiacSignId;
  pos: number; // Позиция в знаке (0-30°)
  absPos: number; // Абсолютная позиция (0-360°)
  retrograde: boolean;
  speed: number; // Скорость в градусах/день (отриц. = ретроградное)
  isStationary: boolean; // Стационарная точка (смена движения)
  latitudeDeg: number; // Эклиптическая широта
  distanceAu: number; // Расстояние в астрономических единицах
  positionText: string; // Форматированная строка ("10°24' Pisces")
  degreeInSign: number; // Градус в знаке (0-30)
  longitudeDeg: number; // Эклиптическая долгота (0-360)
  declinationDeg?: number; // Склонение (нет у Sun)
  motionState: MotionState; // "direct" | "retrograde" | "stationary"
}

interface Ingress {
  body: BodyName;
  sign: Sign;
  degreeInSign: number;
  direction: 'entering_sign' | 'leaving_sign';
}

// Коллекция всех тел
export type BodiesCollection = Partial<Record<BodyName, AstroBody>>;

export interface EphemerisData {
  timestamp: string; // ISO 8601 datetime (UTC)
  localTimestamp: string; // ISO 8601 datetime с часовым поясом
  bodies: BodiesCollection;
  astrology: {
    angularBodies: string[];
    ingresses: Ingress[];
    moonPhase: {
      name: MoonPhaseName;
      phaseAngleDeg: number;
      isWaxing: boolean;
    };
    moonVoidOfCourse: {
      isVoid: boolean;
      definition: string;
      currentSign: ZodiacSign;
      nextSign: Sign;
      signIngressAt: string;
    };
    notableConditions: string[];
    retrogradeBodies: BodyName[];
    stations: { body: BodyName; motionState: string; speed: number }[];
  };
}

export type EphemerisResponse = EphemerisData;

export type EphemerisByRangeResponse = Array<EphemerisData>;

export type {
  PersonalTransit,
  PersonalTransitInput,
  PersonalTransitSummary,
  TransitAngleId,
  TransitPhase,
  TransitTargetId,
} from './transit';
export type {
  PersonalTransitReport,
  TransitHistoryItem,
  TransitReadingContent,
  TransitReadingFactor,
  TransitReportStatus,
} from './transitReport';
