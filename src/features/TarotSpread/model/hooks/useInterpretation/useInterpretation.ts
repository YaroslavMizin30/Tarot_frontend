import { useState } from 'react';

import requestAi from '@/shared/api/AI';

import type { Card } from '@/entities/TarotCard';
import type { SpreadParams } from '@/entities/Spread';

import useLocales from '@/shared/hooks/useLocales';

export const useInterpretation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [interpretation, setInterpretation] = useState<string[] | null>(null);

  const { i18n } = useLocales();

  const getInterpretation = async (cards: Card[], spread: SpreadParams) => {
    const { title, userAnswer, question, detailsAnswer } = spread;

    const cardInfo = cards.reduce((acc, card, index) => {
      //eslint-disable-next-line
      acc += `${i18n(card.name)}${card.isInverted ? '(перевернута)' : ''}${index === cards.length - 1 ? '.' : ', '} `;

      return acc;
    }, '');

    const userMessage = `${i18n('Question')}: ${question ? `${i18n(question)}` : `${userAnswer}`}${detailsAnswer ? `, ${detailsAnswer}: ${userAnswer}` : ''}`;
    const developerMessage = `${i18n('Need tarot spread interpretation')}. ${title ? `${'Spread title'}: "${title}".` : ''} ${i18n('Cards')}: ${cardInfo} ${i18n('Do not talk about user as a third person')}`;

    try {
      setIsLoading(true);

      const interpretation = await requestAi([
        { role: 'user', content: userMessage },
        { role: 'developer', content: developerMessage },
      ]);

      setInterpretation(interpretation.replace(/[#|*|-]/g, '').split('\n'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getInterpretation,
    interpretation,
  };
};
