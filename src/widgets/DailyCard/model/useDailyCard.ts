import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useActivity } from '@/entities/Activity';
import {
  DAILY_CARD_SPREAD_MARKER,
  SpreadType,
  type SpreadParams,
  useSpreads,
} from '@/entities/Spread';
import { type Card } from '@/entities/TarotCard';
import { useUser } from '@/entities/User';
import { useInterpretation } from '@/features/TarotSpread';
import useLocales from '@/shared/hooks/useLocales';
import { getNextMidnight } from '@/shared/utils/getNextMidnight';
import { isToday } from '@/shared/utils/isToday';

import {
  findDailySpread,
  getDailyCard,
  getDailySpreadId,
} from '../lib/dailyCard';

export const useDailyCard = (
  dayKey: string,
  areTranslationsReady: boolean,
) => {
  const { user } = useUser();
  const {
    activity,
    error: activityError,
    isFetching: isActivityFetching,
    isLoading: isActivityLoading,
    refetchActivity,
    updateActivity,
  } = useActivity();
  const {
    spreads,
    error: spreadsError,
    fetchSpreads,
    isFetching: areSpreadsFetching,
    isLoading: areSpreadsLoading,
  } = useSpreads();
  const { i18n } = useLocales();

  const {
    error: interpretationError,
    getInterpretation,
    interpretation: requestedInterpretation,
    isLoading: isInterpretationLoading,
  } = useInterpretation({ isFree: true });

  const [revealedAt, setRevealedAt] = useState<string | null>(null);
  const [hasRevealSaveError, setHasRevealSaveError] = useState(false);
  const requestStartedRef = useRef(false);

  const dailySpreadId = useMemo(() => {
    if (!user) {
      return null;
    }

    return getDailySpreadId(user.id, dayKey);
  }, [dayKey, user]);

  const storedSpread = useMemo(() => {
    if (!dailySpreadId) {
      return null;
    }

    return findDailySpread(spreads, dailySpreadId, dayKey);
  }, [dailySpreadId, dayKey, spreads]);

  const card = useMemo<Card | null>(() => {
    const storedCard = storedSpread?.cards[0];

    if (storedCard) {
      return storedCard;
    }

    if (!user) {
      return null;
    }

    return getDailyCard(user.id, dayKey);
  }, [dayKey, storedSpread, user]);

  const interpretation = useMemo(() => {
    if (requestedInterpretation?.some(Boolean)) {
      return requestedInterpretation.filter(Boolean);
    }

    if (!storedSpread?.interpretation.trim()) {
      return [];
    }

    return storedSpread.interpretation.split('\n').filter(Boolean);
  }, [requestedInterpretation, storedSpread]);

  const activityDate = activity?.dailyCardLastDate ?? null;
  const wasRevealedToday = activityDate ? isToday(activityDate) : false;
  const isRevealed = wasRevealedToday || Boolean(revealedAt);
  const hasDataError = Boolean(activityError || spreadsError);

  const isBooting =
    hasDataError ||
    isActivityLoading ||
    areSpreadsLoading ||
    (isActivityFetching && !revealedAt) ||
    (areSpreadsFetching &&
      (!storedSpread || !storedSpread.interpretation.trim()) &&
      !requestedInterpretation &&
      !isInterpretationLoading) ||
    !areTranslationsReady ||
    !user ||
    !card ||
    !dailySpreadId;

  const spreadParams = useMemo<SpreadParams | null>(() => {
    if (!user) {
      return null;
    }

    return {
      id: SpreadType.SINGLE,
      cardsCount: 1,
      question: i18n('Card of the day'),
      title: DAILY_CARD_SPREAD_MARKER,
      userId: user.id,
    };
  }, [i18n, user]);

  const requestInterpretation = useCallback(() => {
    if (!card || !dailySpreadId || !spreadParams) {
      return;
    }

    requestStartedRef.current = true;

    getInterpretation([card], spreadParams, {
      spreadId: storedSpread?.spreadId ?? dailySpreadId,
      persistBeforeRequest: !storedSpread,
    }).catch(() => undefined);
  }, [card, dailySpreadId, getInterpretation, spreadParams, storedSpread]);

  useEffect(() => {
    if (
      isBooting ||
      interpretation.length > 0 ||
      interpretationError ||
      requestStartedRef.current
    ) {
      return;
    }

    requestInterpretation();
  }, [
    interpretation.length,
    interpretationError,
    isBooting,
    requestInterpretation,
  ]);

  const saveReveal = useCallback(
    (timestamp: string) => {
      setHasRevealSaveError(false);

      updateActivity({ dailyCardLastDate: timestamp }).catch(() => {
        setHasRevealSaveError(true);
      });
    },
    [updateActivity],
  );

  const revealCard = useCallback(() => {
    if (isRevealed) {
      return;
    }

    const timestamp = new Date().toISOString();

    setRevealedAt(timestamp);
    saveReveal(timestamp);

    if (user?.audio) {
      const audio = new Audio('/assets/sfx/flip.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => undefined);
    }
  }, [isRevealed, saveReveal, user?.audio]);

  const retryRevealSave = useCallback(() => {
    if (revealedAt) {
      saveReveal(revealedAt);
    }
  }, [revealedAt, saveReveal]);

  const retryInterpretation = useCallback(() => {
    requestStartedRef.current = false;
    requestInterpretation();
  }, [requestInterpretation]);

  const retryData = useCallback(() => {
    Promise.all([refetchActivity(), fetchSpreads()]).catch(() => undefined);
  }, [fetchSpreads, refetchActivity]);

  const nextAvailableAt = isRevealed
    ? getNextMidnight(revealedAt ?? activityDate)
    : null;

  return {
    card,
    hasDataError,
    interpretation,
    interpretationError,
    hasRevealSaveError,
    isBooting,
    isInterpretationLoading,
    isRevealed,
    nextAvailableAt,
    retryInterpretation,
    retryData,
    retryRevealSave,
    revealCard,
  };
};
