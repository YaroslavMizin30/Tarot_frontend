const MAX_FREE_SPREADS = 3;

export const isTrialAvailable = (spreadCount: number) => {
  return spreadCount < MAX_FREE_SPREADS;
};
