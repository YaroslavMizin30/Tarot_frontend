import React, { useEffect, type FC } from 'react';

import Button from '@/shared/ui/Button';
import useLocales from '@/shared/hooks/useLocales';
import TarotCard from '@/entities/TarotCard';

import { SpreadConfig } from '../config/spreads';
import { useReading } from '../model/hooks/useReading/useReading';
import { useInterpretation } from '../model/hooks/useInterpretation/useInterpretation';
import Spinner from '@/shared/ui/Spinner';

import Placeholder from './Placeholder/Placeholder';
import { type TarotSpreadProps } from './TartotSpread.props';
import styles from './TarotSpread.module.css';
import TextContainer from '@/shared/ui/TextContainer';
import { Link } from 'react-router';

export const TarotSpread: FC<TarotSpreadProps> = (props) => {
  const { spread } = props;

  const { title, id, cardsCount } = spread;

  const { cards, activeCard, isFinished, prepareCards, changeActiveCard } =
    useReading();
  const { getInterpretation, interpretation, isLoading } = useInterpretation();

  const { i18n } = useLocales();

  const handleCardClick = () => {
    changeActiveCard();
  };

  const handleFinishButtonClick = () => {
    getInterpretation(cards, spread);
  };

  useEffect(() => {
    prepareCards(cardsCount);
  }, []);

  if (interpretation) {
    return (
      <div className={styles.tarotSpread}>
        <h3 className={styles.title}>{title}</h3>

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
          paragraphs={interpretation}
          maxHeight={400}
          maxHeightMeasure={'px'}
          className={styles.interpretation}
        />

        <Link to={'/history'}>
          <Button>{i18n('To spreads history')}</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        {i18n('Interpreting')}...
        <Spinner size={'l'} />
      </div>
    );
  }

  return (
    <div className={styles.tarotSpread}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.cards}>
        {SpreadConfig[id].cards.map((item, idx) => {
          const {
            index,
            title,
            description,
            tooltipPosition,
            tooltipStyle,
            ...style
          } = item;

          const { name, isInverted } = cards[idx] ?? {};

          const count = idx + 1;

          return (
            <Placeholder
              key={`${title} ${index}`}
              style={style}
              index={index}
              title={title}
              description={description}
              tooltipPosition={
                tooltipPosition as 'left' | 'right' | 'bottom' | 'top'
              }
              tooltipStyle={tooltipStyle}
            >
              <TarotCard
                key={name}
                name={name}
                localizedName={i18n(name)}
                className={`${styles.card} ${count === activeCard && styles['active-card']}`}
                style={{
                  animationDelay: `${count}s`,
                  animationFillMode: 'forwards',
                }}
                isInverted={isInverted}
                onClick={handleCardClick}
                canTurnOver={count === activeCard}
                isReversed={true}
              />
            </Placeholder>
          );
        })}

        {isFinished && (
          <Button
            className={styles.button}
            onClick={handleFinishButtonClick}
            style={SpreadConfig[id].button}
            isLoading={isLoading}
          >
            {i18n('Interpretation')}
          </Button>
        )}
      </div>
    </div>
  );
};
