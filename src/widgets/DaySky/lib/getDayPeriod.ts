export type DayPeriod = 'dawn' | 'day' | 'dusk' | 'night';

export const getDayPeriod = (hour: number): DayPeriod => {
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 18) return 'day';
  if (hour >= 18 && hour < 22) return 'dusk';
  return 'night';
};
