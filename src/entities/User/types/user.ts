import { type Sign } from '@/shared/ui/Zodiac';

export interface GetUserResponse {
  activity_preference: string;
  communication_type: string | null;
  day_spending: string;
  decision_making: string;
  goals: string;
  id: number;
  energy_type: string;
  last_horoscope: number | null;
  relationship_preference: string;
  resort_preference: string;
  sign: Sign;
  situation: string;
  stress_reaction: string;
  user_name: string;
  way_of_life: string;
}

export interface User {
  activityPreference: string;
  communicationType: string | null;
  daySpending: string;
  decisionMaking: string;
  goals: string;
  id: number;
  energyType: string;
  lastHoroscope: number | null;
  relationshipPreference: string;
  resortPreference: string;
  sign: Sign;
  situation: string;
  stressReaction: string;
  userName: string;
  wayOfLife: string;
}
