import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/shared/api/queryKeys';
import {
  getDailyBonusStatus,
  playDailyBonus,
  playRiskBonus,
  type BonusGameMode,
  type DailyBonusResult,
  type DailyBonusStatus,
  type RiskBonusUnavailable,
} from '@/entities/BonusGame';

import type { PlayingCard } from '../types';
import { createPlayingCard, DISPLAY_CARDS } from '../config/cards';

export const useRoulette = () => {
  const queryClient = useQueryClient();
  const [playingCards, setPlayingCards] = useState<PlayingCard[]>(DISPLAY_CARDS);

  const statusQuery = useQuery({
    queryKey: queryKeys.dailyBonus.all,
    queryFn: getDailyBonusStatus,
  });

  const playMutation = useMutation<
    DailyBonusResult | DailyBonusStatus | RiskBonusUnavailable,
    Error,
    BonusGameMode
  >({
    mutationFn: (mode: BonusGameMode) =>
      mode === 'risk' ? playRiskBonus() : playDailyBonus(),
  });

  const play = async (
    mode: BonusGameMode,
  ): Promise<DailyBonusResult | null> => {
    const result = await playMutation.mutateAsync(mode);
    if (result.status !== 'played') return null;
    return result;
  };

  const applyResultCards = (result: DailyBonusResult) => {
    setPlayingCards(
      result.cards.map((id, index) =>
        createPlayingCard(
          id,
          index === result.selectedIndex
            ? { type: result.rewardType, bonusDelta: result.bonusDelta }
            : undefined,
        ),
      ),
    );
  };

  const revealResult = async (
    result: DailyBonusResult,
    mode: BonusGameMode,
  ) => {
    queryClient.setQueryData<DailyBonusStatus>(
      queryKeys.dailyBonus.all,
      () => ({
        status: 'already_played',
        bonusBalance: result.bonusBalance,
        progress: result.progress,
        nextAvailableAt: result.nextAvailableAt,
        riskStatus: mode === 'risk'
          ? 'already_played'
          : result.bonusBalance > 0
            ? 'available'
            : 'insufficient_bonus',
      }),
    );
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.dailyBonus.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all }),
    ]);
  };

  const status = statusQuery.data;

  const retry = async () => {
    playMutation.reset();
    await statusQuery.refetch();
  };

  return {
    playingCards,
    play,
    applyResultCards,
    revealResult,
    progress: status?.progress ?? 0,
    bonusBalance: status?.bonusBalance ?? 0,
    nextAvailableAt: status?.nextAvailableAt,
    isLoading: statusQuery.isLoading,
    isError: statusQuery.isError || playMutation.isError,
    retry,
    isPlaying: playMutation.isPending,
    dailyStatus: status?.status,
    riskStatus: status?.riskStatus,
  };
};
