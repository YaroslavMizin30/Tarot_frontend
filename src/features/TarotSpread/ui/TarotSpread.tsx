import React, { useEffect, useState, type FC } from 'react';

import { useBlocker } from 'react-router';

import Button from '@/shared/ui/Button';
import Modal from '@/shared/ui/Modal';
import useLocales from '@/shared/hooks/useLocales';
import RatingInput from '@/shared/ui/RatingInput';

import TarotCard from '@/entities/TarotCard';
import { updateSpread } from '@/entities/Spread';

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
  const { spread, onSpreadFinish } = props;

  const { title, id, cardsCount } = spread;

  const { cards, activeCard, isFinished, prepareCards, changeActiveCard } =
    useReading();
  const { getInterpretation, interpretation, isLoading, spreadId } =
    useInterpretation();

  const { i18n } = useLocales();

  const handleCardClick = () => {
    changeActiveCard();
  };

  const [rating, setRating] = useState(1);

  const { state, reset, proceed } = useBlocker(!interpretation);

  const handleRatingInputChange = async (rate: number) => {
    setRating(rate);

    if (spreadId) {
      await updateSpread(spreadId, { rating: rate });
    }
  };

  const handleFinishButtonClick = async () => {
    await getInterpretation(cards, spread);

    reset?.();

    onSpreadFinish?.(spread, cards);
  };

  const handleModalClose = () => {
    reset?.();
  };

  const handleModalConfirm = () => {
    proceed?.();
  };

  useEffect(() => {
    prepareCards(cardsCount);

    return () => {
      reset?.();
    };
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

        <RatingInput value={rating} onChange={handleRatingInputChange} />

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
        <Spinner size={'l'} className={styles.spinner} />
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

      {state === 'blocked' && (
        <Modal
          onClose={handleModalClose}
          isOpen={true}
          className={styles.modal}
        >
          {i18n('Your spread is not ready yet. Are you sure?')}

          <div className={styles.buttons}>
            <Button onClick={handleModalConfirm}>{i18n('Yes')}</Button>
            <Button onClick={handleModalClose}>{i18n('No')}</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
