export const queryKeys = {
  user: {
    all: ['user'] as const,
    byId: (id: string | number) => ['user', String(id)] as const,
  },
  spreads: {
    all: ['spreads'] as const,
    byUserId: (userId: string | number) => ['spreads', String(userId)] as const,
  },
  summaries: {
    all: ['summaries'] as const,
    byUserId: (userId: string | number) =>
      ['summaries', String(userId)] as const,
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
  analytics: {
    all: ['analytics'] as const,
    byUserId: (userId: string | number) =>
      ['analytics', String(userId)] as const,
  },
};
