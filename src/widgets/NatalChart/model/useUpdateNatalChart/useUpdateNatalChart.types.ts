export interface UpdateNatalChartOptions {
  userId: string;
  name: string;
  year: string;
  month: string;
  day: string;
  country: string;
  city: string;
  time?: string;
  /**
   * ISO-8601 timestamp of the user's current subscription expiration.
   * Used to enforce the once-per-paid-period update restriction.
   */
  expirationDate?: string;
}

export type UpdateNatalChartResult =
  | { success: true }
  | { success: false; nextAvailableAt?: string; reason?: 'rate-limited' | 'error' };
