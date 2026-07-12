import { type Sign } from '@/shared/ui/Zodiac';

import { type NatalChart } from '@/entities/Horoscope/types/chart';

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
}
