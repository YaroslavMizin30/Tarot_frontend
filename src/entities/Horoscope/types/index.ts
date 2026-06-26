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
