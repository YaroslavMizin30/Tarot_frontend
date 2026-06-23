import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import requestAi, { type Prompt } from '@/shared/api/AI';
import { queryKeys } from '@/shared/api/queryKeys';

import { getSummaries } from '../api/getSummaries';
import { addSummary as addNewSummary } from '../api/addSummary';
import type { Spread } from '../types';

import { useUser } from '@/entities/User';
import useLocales from '@/shared/hooks/useLocales';

export const useSummaries = (onSummaryEnd?: () => void | Promise<void>) => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { i18n } = useLocales();

  const {
    data: summaries,
    isLoading,
  } = useQuery({
    queryKey: queryKeys.summaries.byUserId(user?.id ?? 'no-user'),
    queryFn: () => getSummaries(user!.id),
    enabled: !!user,
  });

  const addSummaryMutation = useMutation({
    mutationFn: async (spreads: Spread[]) => {
      if (!user) {
        throw new Error('No user');
      }

      const messages = spreads.map((spread) => {
        const {
          question,
          userAnswer,
          detailsAnswer,
          interpretation,
          title,
          cards,
          rating,
          date,
        } = spread;

        const cardInfo = cards.reduce((acc, card, index) => {
          //eslint-disable-next-line
          acc += `${i18n(card.name)}${card.isInverted ? '(перевернута)' : ''}${index === cards.length - 1 ? '.' : ', '} `;

          return acc;
        }, '');

        return [
          {
            role: 'user',
            content: `${i18n('Question')}: ${question ? `${i18n(question)}` : `${userAnswer}`}${detailsAnswer ? `, ${detailsAnswer}: ${userAnswer}` : ''}`,
          },
          {
            role: 'developer',
            content: `${i18n('Need tarot spread interpretation')}. ${title ? `${i18n('Spread title')}: "${title}".` : ''} ${i18n('Cards')}: ${cardInfo} ${i18n('Do not talk about user as a third person')}, ${typeof rating === 'number' ? `${i18n('User rated the answer as')} ${rating}` : ''} ${i18n('Date of reading')}: ${date}`,
          },
          { role: 'assistant', content: interpretation },
        ];
      });

      const prompt = [
        ...messages.flat(),
        {
          role: 'user',
          content: i18n(
            'What do these readings say about me and my life for this period',
          ),
        },
        {
          role: 'developer',
          content: i18n(
            `Make summary and analysis of the aspects raised in these readings. Consider how user rated each assistant answer (if rated). Highlight some repeated tendencies, if there are any. ${i18n('Do not talk about user as a third person')}. ${i18n('Do not mention user rating. Use rating to mention less spreads with low rating')}`,
          ),
        },
      ];

      const response = await requestAi(prompt as Prompt[]);

      if (response) {
        await addNewSummary(user.id, response);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.summaries.all,
      });

      onSummaryEnd?.();
    },
  });

  return {
    isLoading,
    isAnalyzing: addSummaryMutation.isPending,
    summaries,
    addSummary: addSummaryMutation.mutateAsync,
  };
};
