export const queryKeys = {
  platformProfile: {
    all: ['platform-profile'] as const,
    current: ['platform-profile', 'current'] as const,
  },
  user: {
    all: ['user'] as const,
    current: ['user', 'current'] as const,
    byId: (id: string | number) => ['user', String(id)] as const,
  },
  horoscopes: {
    all: ['horoscopes'] as const,
    byUserId: (userId: string | number) =>
      ['horoscopes', String(userId)] as const,
  },
  generalHoroscopes: {
    all: ['general-horoscopes'] as const,
    bySign: (sign: string, locale: string) =>
      ['general-horoscopes', sign, locale] as const,
  },
  calendar: {
    all: ['calendar'] as const,
  },
  moonPlans: {
    all: ['moon-plans'] as const,
    byUserDate: (userId: string | number, date: string) =>
      ['moon-plans', String(userId), date] as const,
  },
  ephemeris: {
    all: ['ephemeris'] as const,
    month: ['ephemeris', 'week'] as const,
    week: ['ephemeris', 'month'] as const,
  },
  dailyReflection: {
    all: ['daily-reflection'] as const,
    byUserDate: (userId: string | number, date: string) =>
      ['daily-reflection', String(userId), date] as const,
  },
  dailyBonus: {
    all: ['daily-bonus'] as const,
  },
  spreads: {
    all: ['spreads'] as const,
    byUserId: (userId: string | number) => ['spreads', String(userId)] as const,
    history: (userId: string | number) =>
      ['spreads', 'history', String(userId)] as const,
    detail: (spreadId: string) =>
      ['spreads', 'detail', spreadId] as const,
    pending: (userId: string | number) =>
      ['spreads', 'pending', String(userId)] as const,
  },
  rating: {
    all: ['rating'] as const,
    byUserId: (userId: string | number) => ['rating', String(userId)] as const,
  },
  activity: {
    all: ['activity'] as const,
    byUserId: (userId: string | number) =>
      ['activity', String(userId)] as const,
  },
};
