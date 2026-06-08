export interface AnalyticsUserState {
  telegram_user_id: number;
  username?: string;
  registered: boolean;
  first_name?: string;
  first_visit_at: string;
  last_action_at: string;
  visit_count: number;
  predictions_count: number;
  tarot_spreads_count: number;
  tariff_purchases_count: number;
  last_prediction_type: 'daily' | 'monthly' | 'weekly' | 'summary' | null;
  last_tariff_id: 'standard' | 'extended' | null;
  last_payment_method: 'stars' | 'yookassa' | null;
}

export interface AnalyticsPayload {
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
