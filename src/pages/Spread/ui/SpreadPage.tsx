import { useEffect, useState } from 'react';

import { useNavigate, Link, useLocation } from 'react-router';

import useLocales from '@/shared/hooks/useLocales';
import TextContainer from '@/shared/ui/TextContainer';
import Button from '@/shared/ui/Button';
import TRANSLATIONS_HISTORY_EN from '@/shared/locales/en/history';
import TRANSLATIONS_HISTORY_RU from '@/shared/locales/ru/history';
import RatingInput from '@/shared/ui/RatingInput';
import ArrowButton from '@/shared/ui/ArrowButton';

import {
  DAILY_CARD_SPREAD_MARKER,
  type Spread,
  updateSpread,
} from '@/entities/Spread';
import TarotCard from '@/entities/TarotCard';

import styles from './SpreadPage.module.css';

export const SpreadPage = () => {
  const { state } = useLocation();
  const { i18n, addTranslations } = useLocales();
  const navigate = useNavigate();

  const { interpretation, title, cards, spreadId, rating } = state as Spread;

  const [rate, setRate] = useState(rating);

  const handleRatingInputChange = async (value: number) => {
    setRate(value);

    await updateSpread(spreadId, { rating: value });
  };

  useEffect(() => {
    addTranslations({
      en: { ...TRANSLATIONS_HISTORY_EN },
      ru: { ...TRANSLATIONS_HISTORY_RU },
    });
  }, [addTranslations]);

  return (
    <div className={styles.tarotSpread}>
      <h3 className={styles.title}>
        {title === DAILY_CARD_SPREAD_MARKER ? i18n(title) : title}
      </h3>

      <div className={styles['interpretation-container']}>
        <div className={`${styles['cards']} custom-scrollbar`}>
          {cards.map((card) => {
            const { name, isInverted } = card;

            return (
              <TarotCard
                size={'m'}
                name={name}
                key={name}
                localizedName={i18n(name)}
                isInverted={isInverted}
                className={styles['card']}
                hasLoadingState
              />
            );
          })}
        </div>

        <TextContainer
          paragraphs={interpretation.split('\n')}
          maxHeight={596}
          maxHeightMeasure={'px'}
          className={styles.interpretation}
        >
          <RatingInput
            className={styles.rating}
            value={rate ?? 0}
            onChange={handleRatingInputChange}
          />
        </TextContainer>
      </div>

      <div className={styles.bottom}>
        <ArrowButton onClick={() => navigate('/tarot')} />

        <Link className={styles.link} to={'/history'}>
          <Button>{i18n('To spreads history')}</Button>
        </Link>
      </div>
    </div>
  );
};
