import { ensureSupabase } from '@/shared/api/supabase';

import type { CardName } from '@/entities/TarotCard';

export type DailyBonusRewardType =
  | 'pentacles'
  | 'reading_credit'
  | 'progress'
  | 'major'
  | 'jackpot'
  | 'risk_loss'
  | 'risk_return'
  | 'risk_win'
  | 'risk_jackpot';

export type BonusGameMode = 'daily' | 'risk';
export type RiskBonusStatus =
  | 'available'
  | 'daily_card_required'
  | 'already_played'
  | 'insufficient_bonus';

export interface DailyBonusStatus {
  status: 'available' | 'already_played';
  bonusBalance: number;
  progress: number;
  riskStatus?: RiskBonusStatus;
  nextAvailableAt?: string | null;
}

export interface DailyBonusResult extends Omit<DailyBonusStatus, 'status'> {
  status: 'played';
  cardId: CardName;
  rewardType: DailyBonusRewardType;
  bonusDelta: number;
  selectedIndex: number;
  cards: CardName[];
  mode?: 'risk';
  stake?: number;
  payout?: number;
}

export interface RiskBonusUnavailable {
  status: Exclude<RiskBonusStatus, 'available'>;
  bonusBalance: number;
  progress: number;
  required?: number;
}

const invoke = async <T>(
  action: 'status' | 'play' | 'play-risk',
): Promise<T> => {
  await ensureSupabase();
  const { data, error } = await window.supabase.functions.invoke(
    'daily-bonus',
    { body: { action } },
  );
  if (error) throw error;
  if (!data || typeof data !== 'object' || !('status' in data)) {
    throw new Error('Invalid daily bonus response');
  }
  return data as T;
};

export const getDailyBonusStatus = () => invoke<DailyBonusStatus>('status');

export const playDailyBonus = () =>
  invoke<DailyBonusResult | DailyBonusStatus>('play');

export const playRiskBonus = () =>
  invoke<DailyBonusResult | RiskBonusUnavailable>('play-risk');
