export interface AnalyticsPayload {
  appUserId?: string;
  /** @deprecated Internal profile key; use appUserId for ownership. */
  telegramUserId: number;
  username?: string;
  registered: boolean;
  firstName?: string;
  firstVisitAt: string;
  lastActionAt: string;
  visitCount: number;
  predictionsCount: number;
  tarotSpreadsCount: number;
  tariffPurchasesCount: number;
  lastPredictionType: 'daily' | 'monthly' | 'weekly' | 'summary' | null;
  lastTariffId: 'standard' | 'extended' | null;
  lastPaymentMethod: 'stars' | 'yookassa' | null;
}
