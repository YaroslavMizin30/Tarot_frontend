import { type Sign } from '@/shared/ui/Zodiac';

import { type NatalChart } from '@/entities/Horoscope/types/chart';

export type TarotProfileFocus =
  | 'relationships'
  | 'career'
  | 'money'
  | 'wellbeing'
  | 'change'
  | 'direction';

export interface TarotProfile {
  version: 1;
  focus?: TarotProfileFocus[];
  lifeStage?:
    | 'starting'
    | 'choosing'
    | 'moving'
    | 'changing'
    | 'recovering'
    | 'uncertain';
  readingPreference?: 'conclusion' | 'scenarios' | 'causes' | 'next_step';
  tone?: 'supportive' | 'neutral' | 'direct';
  context?: string;
  completedSteps?: string[];
  updatedAt?: string;
}

export interface User {
  id: number;
  sign: Sign;
  userName: string;
  birthDate: string;
  birthTime?: string;
  birthPlace: string;
  natalChart: NatalChart;
  freeHoroscopes: number;
  freeSpreads: number;
  tariff: 'standard' | 'trial' | 'extended';
  expirationDate: string;
  theme: 'standard' | 'gray' | 'bronze';
  audio: boolean;
  balance: number;
  bonusBalance?: number;
  tarotProfile?: TarotProfile;
}
