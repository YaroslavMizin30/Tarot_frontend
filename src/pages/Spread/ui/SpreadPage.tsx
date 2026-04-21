import React, { useEffect, useState } from 'react';

import { useLocation } from 'react-router';

import useLocales from '@/shared/hooks/useLocales';
import TextContainer from '@/shared/ui/TextContainer';
import TRANSLATIONS_EN from '@/shared/locales/en/history';
import TRANSLATIONS_RU from '@/shared/locales/ru/history';
import RatingInput from '@/shared/ui/RatingInput';

import { type Spread, updateSpread } from '@/entities/Spread';
import TarotCard from '@/entities/TarotCard';

import styles from './SpreadPage.module.css';

export const SpreadPage = () => {
  const { state } = useLocation();
  const { i18n, addTranslations } = useLocales();

  const {
    date,
    interpretation,
    title,
    userAnswer,
    detailsAnswer,
    cards,
    question,
    rating,
    spreadId,
  } = state as Spread;

  const [rate, setRate] = useState(rating);

  const handleRatingInputChange = async (value: number) => {
    setRate(value);

    await updateSpread(spreadId, { rating: value });
  };

  useEffect(() => {
    addTranslations({
      en: TRANSLATIONS_EN,
      ru: TRANSLATIONS_RU,
    });
  }, []);

  return (
    <div className={`${styles.container} custom-scrollbar`}>
      <div className={styles.info}>
        <span>{`${i18n('Question')}: ${question || userAnswer}`}</span>

        {detailsAnswer && <span>{`${detailsAnswer}: ${userAnswer}`}</span>}

        {title && <span>{`${i18n('Title')}: ${title}`}</span>}

        <span>
          {i18n('Date')}: {date}
        </span>
      </div>

      <div className={styles['cards-small']}>
        {cards.map((card) => {
          const { name, isInverted } = card;

          return (
            <TarotCard
              name={name}
              key={name}
              localizedName={i18n(name)}
              isInverted={isInverted}
              className={styles['card-small']}
            />
          );
        })}
      </div>

      <TextContainer
        paragraphs={interpretation.replace(/[-|*]/g, '').split('\n')}
        maxHeight={350}
        maxHeightMeasure={'px'}
        className={styles.interpretation}
      />

      <RatingInput value={rate ?? 0} onChange={handleRatingInputChange} />
    </div>
  );
};
