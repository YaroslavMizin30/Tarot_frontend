import { type Sign } from '@/shared/ui/Zodiac';

export interface GetUserResponse {
  id: number;
  sign: Sign;
  user_name: string;
  birth_date: string;
  birth_time?: string;
  birth_place: string;
  natal_chart: string;
  free_horoscopes: number;
  free_spreads: number;
  tariff: 'standard' | 'trial' | 'extended';
  expiration_date: string;
}

export interface User {
  id: number;
  sign: Sign;
  userName: string;
  birthDate: string;
  birthTime?: string;
  birthPlace: string;
  natalChart: string;
  freeHoroscopes: number;
  freeSpreads: number;
  tariff: 'standard' | 'trial' | 'extended';
  expirationDate: string;
}
