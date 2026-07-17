import { useState } from 'react';
import { v4 } from 'uuid';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import requestAi from '@/shared/api/AI';
import { queryKeys } from '@/shared/api/queryKeys';
import useLocales from '@/shared/hooks/useLocales';
import { getTodayString } from '@/shared/utils/getTodayString';

import type { Card } from '@/entities/TarotCard';
import type { Spread, SpreadParams } from '@/entities/Spread';
import { addSpread, updateSpread } from '@/entities/Spread';
import { useUser } from '@/entities/User';
import { useBalance } from '@/features/Billing';
import { sendAnalytics, getAnalytics } from '@/entities/Analytics';

interface UseInterpretationOptions {
  onFinish?: (interpretation?: string) => void;
  isFree?: boolean;
}

interface InterpretationRequestOptions {
  spreadId?: string;
  persistBeforeRequest?: boolean;
}

const pendingInterpretationRequests = new Map<string, Promise<string>>();

export const useInterpretation = (options: UseInterpretationOptions = {}) => {
  const [interpretation, setInterpretation] = useState<string[] | null>(null);
  const [spreadId, setSpreadId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();
  const { requireBalance, charge } = useBalance();
  const queryClient = useQueryClient();

  const { i18n } = useLocales();

  const getInterpretationMutation = useMutation({
    mutationFn: async ({
      cards,
      spread,
      requestOptions,
    }: {
      cards: Card[];
      spread: SpreadParams;
      requestOptions?: InterpretationRequestOptions;
    }) => {
      const { title, userAnswer, question, detailsAnswer, cardsCount } = spread;

      const isPaidSpread = !options.isFree && user?.tariff !== 'trial';

      // Для платных тарифов — проверяем баланс до выполнения.
      // useBalance сам редиректит на /billing при нехватке пентаклей.
      if (isPaidSpread && !requireBalance(cardsCount)) {
        throw new Error('INSUFFICIENT_BALANCE');
      }

      const persistedSpreadId = requestOptions?.spreadId ?? v4();

      if (user && requestOptions?.persistBeforeRequest) {
        const draftSpread: Spread = {
          ...spread,
          cards,
          interpretation: '',
          date: getTodayString(),
          spreadId: persistedSpreadId,
          userId: user.id,
        };

        try {
          await addSpread(draftSpread);

          queryClient.setQueryData<Spread[] | null>(
            queryKeys.spreads.byUserId(user.id),
            (currentSpreads) => {
              if (
                currentSpreads?.some(
                  (currentSpread) =>
                    currentSpread.spreadId === persistedSpreadId,
                )
              ) {
                return currentSpreads;
              }

              return [...(currentSpreads ?? []), draftSpread];
            },
          );
        } catch (draftError) {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.spreads.byUserId(user.id),
          });

          const currentSpreads = queryClient.getQueryData<Spread[] | null>(
            queryKeys.spreads.byUserId(user.id),
          );

          if (
            !currentSpreads?.some(
              (currentSpread) =>
                currentSpread.spreadId === persistedSpreadId,
            )
          ) {
            throw draftError;
          }
        }

        setSpreadId(persistedSpreadId);
      }

      const cardInfo = cards.reduce((acc, card, index) => {
        //eslint-disable-next-line
        acc += `${i18n(card.name)}${`(${card.isInverted ? i18n('inverted') : i18n('upright')})`}${index === cards.length - 1 ? '.' : ', '} `;

        return acc;
      }, '');

      const userMessage = `${i18n('Question')}: ${question ? `${i18n(question)}` : `${userAnswer}`}${detailsAnswer ? `, ${detailsAnswer}: ${userAnswer}` : ''}`;
      const developerMessage = `${i18n('Need tarot spread interpretation')}. ${title ? `${i18n('Spread title')}: "${i18n(title)}".` : ''} ${i18n('Cards')}: ${cardInfo} ${i18n('Do not talk about user as a third person')}`;

      const interpretationText = await requestAi([
        { role: 'user', content: userMessage },
        { role: 'developer', content: developerMessage },
      ]);

      if (user) {
        const completedSpread: Spread = {
          ...spread,
          cards,
          interpretation: interpretationText,
          date: getTodayString(),
          spreadId: persistedSpreadId,
          userId: user.id,
        };

        if (requestOptions?.spreadId || requestOptions?.persistBeforeRequest) {
          await updateSpread(persistedSpreadId, {
            interpretation: interpretationText,
          });
        } else {
          await addSpread(completedSpread);
        }

        queryClient.setQueryData<Spread[] | null>(
          queryKeys.spreads.byUserId(user.id),
          (currentSpreads) => {
            const hasCurrentSpread = currentSpreads?.some(
              (currentSpread) =>
                currentSpread.spreadId === persistedSpreadId,
            );

            if (!hasCurrentSpread) {
              return [...(currentSpreads ?? []), completedSpread];
            }

            return currentSpreads?.map((currentSpread) => {
              return currentSpread.spreadId === persistedSpreadId
                ? completedSpread
                : currentSpread;
            }) ?? [completedSpread];
          },
        );

        // Списываем пентакли только после того, как спред успешно сохранён.
        if (!options.isFree) {
          await charge(cardsCount);
        }

        setSpreadId(persistedSpreadId);

        const { tarotSpreadsCount = 0 } = (await getAnalytics(user.id)) ?? {};

        await sendAnalytics(user.id, {
          lastActionAt: new Date().toISOString(),
          tarotSpreadsCount: tarotSpreadsCount + 1,
        });
      }

      return interpretationText;
    },
    onMutate: () => {
      setError(null);
    },
    onSuccess: (interpretationText) => {
      setInterpretation(interpretationText.split('\n'));

      queryClient.invalidateQueries({
        queryKey: queryKeys.spreads.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.analytics.all,
      });

      options.onFinish?.(interpretationText);
    },
    onError: () => {
      setError(i18n('Error during request, please try again'));
      setInterpretation(null);
    },
  });

  const getInterpretation = (
    cards: Card[],
    spread: SpreadParams,
    requestOptions?: InterpretationRequestOptions,
  ): Promise<string> => {
    const requestId = requestOptions?.spreadId;
    const pendingRequest = requestId
      ? pendingInterpretationRequests.get(requestId)
      : null;

    if (pendingRequest) {
      return pendingRequest.then(
        (interpretationText) => {
          setError(null);
          setInterpretation(interpretationText.split('\n'));
          setSpreadId(requestId ?? null);

          return interpretationText;
        },
        (requestError: unknown) => {
          setError(i18n('Error during request, please try again'));
          throw requestError;
        },
      );
    }

    const request = getInterpretationMutation.mutateAsync({
      cards,
      spread,
      requestOptions,
    });

    if (requestId) {
      pendingInterpretationRequests.set(requestId, request);

      const clearPendingRequest = () => {
        if (pendingInterpretationRequests.get(requestId) === request) {
          pendingInterpretationRequests.delete(requestId);
        }
      };

      request.then(clearPendingRequest, clearPendingRequest);
    }

    return request;
  };

  return {
    isLoading: getInterpretationMutation.isPending,
    getInterpretation,
    interpretation,
    spreadId,
    error,
  };
};
