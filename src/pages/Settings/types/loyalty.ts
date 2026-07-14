type LoyaltyLevel = 'Seeker' | 'Initiate' | 'Adept' | 'Oracle' | 'Magician';

interface Conditions {
  spreadsPerMonth: number;
  spreadSeries: number;
}

interface Bonus {
  type: 'coins' | 'discount' | 'early_access';
  value?: number | string;
  description: string;
}

export interface LoyaltyTier {
  name: LoyaltyLevel;
  conditions: Conditions;
  bonus: Bonus[];
  icon: string;
}
