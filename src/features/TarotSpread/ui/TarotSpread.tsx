import React, { useEffect } from 'react';

import useLocales from '@/shared/hooks/useLocales';

import TarotCard from '@/entities/TarotCard';

import { SpreadConfig } from '../config/spreads/spreads';
import { useReading } from '../model/hooks/useReading/useReading';

import Placeholder from './Placeholder/Placeholder';
import { type TarotSpreadProps } from './TartotSpread.props';

import styles from './TarotSpread.module.css';
import type { FC } from 'react';

export const TarotSpread: FC<TarotSpreadProps> = (props) => {
  const { spread } = props;

  const { title, id, cardsCount } = spread;

  const { cards, activeCard, prepareCards, changeActiveCard } = useReading();

  const { i18n } = useLocales();

  const handleCardClick = () => {
    changeActiveCard();
  };

  useEffect(() => {
    prepareCards(cardsCount);
  }, []);

  return (
    <div className={styles.tarotSpread}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.cards}>
        {SpreadConfig[id].map((item, idx) => {
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
              />
            </Placeholder>
          );
        })}
      </div>
    </div>
  );
};
