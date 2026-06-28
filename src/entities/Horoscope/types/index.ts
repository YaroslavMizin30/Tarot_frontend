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

export type ZodiacSign =
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

export type Planet =
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto';

export type Aspect =
  | 'conjunction'
  | 'opposition'
  | 'trine'
  | 'square'
  | 'sextile'
  | 'quincunx'
  | 'semisextile';

export type MoonPhaseName =
  | 'New Moon'
  | 'Waxing Crescent'
  | 'First Quarter'
  | 'Waxing Gibbous'
  | 'Full Moon'
  | 'Waning Gibbous'
  | 'Last Quarter'
  | 'Waning Crescent';

export interface CalendarResponse {
  timestamp: string;
  phase: {
    name: MoonPhaseName;
    phase_angle_deg: number;
    illumination: number;
    age_days: number;
    distance_km: number;
    is_waxing: false;
  };
  next_phases: {
    new_moon: string;
    first_quarter: string;
    full_moon: string;
    last_quarter: string;
  };
  zodiac: {
    sign: ZodiacSign;
    sign_id: ZodiacSign;
    degree: number;
    zodiac_type: string;
  };
  interpretation: {
    key: string;
    title: string;
    body: string;
    tone: string;
    tags: string[];
  };
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
  sign_abbr: string; // Сокращение знака ("Pis", "Leo")
  sign_id: ZodiacSign;
  pos: number; // Позиция в знаке (0-30°)
  abs_pos: number; // Абсолютная позиция (0-360°)
  retrograde: boolean;
  speed: number; // Скорость в градусах/день (отриц. = ретроградное)
  is_stationary: boolean; // Стационарная точка (смена движения)
  latitude_deg: number; // Эклиптическая широта
  distance_au: number; // Расстояние в астрономических единицах
  position_text: string; // Форматированная строка ("10°24' Pisces")
  degree_in_sign: number; // Градус в знаке (0-30)
  longitude_deg: number; // Эклиптическая долгота (0-360)
  declination_deg?: number; // Склонение (нет у Sun)
  motion_state: MotionState; // "direct" | "retrograde" | "stationary"
}

interface Ingress {
  body: BodyName;
  sign: Sign;
  degree_in_sign: number;
  direction: 'entering_sign' | 'leaving_sign';
}

// Коллекция всех тел
export type BodiesCollection = Partial<Record<BodyName, AstroBody>>;

export interface EphemerisData {
  timestamp: string; // ISO 8601 datetime (UTC)
  local_timestamp: string; // ISO 8601 datetime с часовым поясом
  bodies: BodiesCollection;
  astrology: {
    angular_bodies: string[];
    ingresses: Ingress[];
    moon_phase: {
      name: MoonPhaseName;
      phase_angle_deg: number;
      is_waxing: boolean;
    };
    moon_void_of_course: {
      is_void: boolean;
      definition: string;
      current_sign: ZodiacSign;
      next_sign: Sign;
      sign_ingress_at: string;
    };
    notable_conditions: string[];
    retrograde_bodies: BodyName[];
    stations: string[];
  };
}

export type EphemerisResponse = EphemerisData;
