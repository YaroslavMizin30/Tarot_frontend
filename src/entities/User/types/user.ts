import { type Sign } from '@/shared/ui/Zodiac';

export interface GetUserResponse {
  id: number;
  sign: Sign;
  user_name: string;
  birth_date: string;
  birth_time?: string;
  birth_place: string;
  natal_chart: string;
}

export interface User {
  id: number;
  sign: Sign;
  userName: string;
  birthDate: string;
  birthTime?: string;
  birthPlace: string;
  natalChart: string;
}
