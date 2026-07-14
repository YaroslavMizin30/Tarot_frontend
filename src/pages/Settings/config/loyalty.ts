import type { LoyaltyTier } from '../types/loyalty';

export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    name: 'Seeker',
    conditions: {
      spreadSeries: 0,
      spreadsPerMonth: 0,
    },
    bonus: [],
    icon: '⭐',
  },
  {
    name: 'Initiate',
    conditions: {
      spreadsPerMonth: 4,
      spreadSeries: 7,
    },
    bonus: [{ type: 'coins', value: 5, description: 'coins at once' }],
    icon: '🕯️',
  },
  {
    name: 'Adept',
    conditions: {
      spreadsPerMonth: 11,
      spreadSeries: 14,
    },
    bonus: [
      { type: 'coins', value: 10, description: 'coins at once' },
      { type: 'discount', value: '10%', description: 'permanent discount' },
    ],
    icon: '🌙',
  },
  {
    name: 'Oracle',
    conditions: {
      spreadsPerMonth: 21,
      spreadSeries: 30,
    },
    bonus: [
      { type: 'coins', value: 20, description: 'coins at once' },
      { type: 'discount', value: '20%', description: 'permanent discount' },
    ],
    icon: '🔮',
  },
  {
    name: 'Magician',
    conditions: {
      spreadsPerMonth: 36,
      spreadSeries: 45,
    },
    bonus: [
      { type: 'coins', value: 40, description: 'coins at once' },
      { type: 'discount', value: '30%', description: 'permanent discount' },
      { type: 'early_access', description: 'early access to all updates' },
    ],
    icon: '👑',
  },
];
