import { useState } from 'react';
import { v4 } from 'uuid';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import requestAi from '@/shared/api/AI';
import { queryKeys } from '@/shared/api/queryKeys';
import useLocales from '@/shared/hooks/useLocales';
import { getTodayString } from '@/shared/utils/getTodayString';

import type { Card } from '@/entities/TarotCard';
import type { SpreadParams } from '@/entities/Spread';
import { addSpread } from '@/entities/Spread';
import { useUser, incrementFreeSpreads } from '@/entities/User';
import { sendAnalytics, getAnalytics } from '@/entities/Analytics';

export const useInterpretation = (options: { onFinish?: () => void }) => {
  const [interpretation, setInterpretation] = useState<string[] | null>(null);
  const [spreadId, setSpreadId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user, refetchUser } = useUser();
  const queryClient = useQueryClient();

  const { i18n } = useLocales();

  const getInterpretationMutation = useMutation({
    mutationFn: async ({
      cards,
      spread,
    }: {
      cards: Card[];
      spread: SpreadParams;
    }) => {
      const { title, userAnswer, question, detailsAnswer } = spread;

      const cardInfo = cards.reduce((acc, card, index) => {
        //eslint-disable-next-line
        acc += `${i18n(card.name)}${card.isInverted ? '(перевернута)' : ''}${index === cards.length - 1 ? '.' : ', '} `;

        return acc;
      }, '');

      const userMessage = `${i18n('Question')}: ${question ? `${i18n(question)}` : `${userAnswer}`}${detailsAnswer ? `, ${detailsAnswer}: ${userAnswer}` : ''}`;
      const developerMessage = `${i18n('Need tarot spread interpretation')}. ${title ? `${i18n('Spread title')}: "${title}".` : ''} ${i18n('Cards')}: ${cardInfo} ${i18n('Do not talk about user as a third person')}`;

      const interpretation = await requestAi([
        { role: 'user', content: userMessage },
        { role: 'developer', content: developerMessage },
      ]);

      if (user) {
        const uuid = v4();

        await addSpread({
          ...spread,
          cards,
          interpretation,
          date: getTodayString(),
          spreadId: uuid,
          userId: user.id,
        });

        if (user.tariff === 'trial') {
          await incrementFreeSpreads(user.id);

          refetchUser();
        }

        setSpreadId(uuid);

        const { tarotSpreadsCount = 0 } = (await getAnalytics(user.id)) ?? {};

        await sendAnalytics(user.id, {
          lastActionAt: new Date().toISOString(),
          tarotSpreadsCount: tarotSpreadsCount + 1,
        });
      }

      return interpretation;
    },
    onSuccess: (interpretation) => {
      setInterpretation(interpretation.split('\n'));

      queryClient.invalidateQueries({
        queryKey: queryKeys.spreads.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.analytics.all,
      });

      options.onFinish?.();
    },
    onError: () => {
      setError(i18n('Error during request, please try again'));
      setInterpretation(null);
    },
  });

  return {
    isLoading: getInterpretationMutation.isPending,
    getInterpretation: (cards: Card[], spread: SpreadParams) =>
      getInterpretationMutation.mutateAsync({ cards, spread }),
    interpretation,
    spreadId,
    error,
  };
};
