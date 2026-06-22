import { useEffect, useState, type FC } from 'react';

import { useBlocker, useNavigate } from 'react-router';

import Button from '@/shared/ui/Button';
import Modal from '@/shared/ui/Modal';
import useLocales from '@/shared/hooks/useLocales';
import RatingInput from '@/shared/ui/RatingInput';
import Error from '@/shared/ui/Error';
import ArrowButton from '@/shared/ui/ArrowButton';

import TarotCard from '@/entities/TarotCard';
import { updateSpread } from '@/entities/Spread';
import { useUser } from '@/entities/User';

import { SpreadConfig } from '../config/spreads';
import { useReading } from '../model/hooks/useReading/useReading';
import { useInterpretation } from '../model/hooks/useInterpretation/useInterpretation';

import Placeholder from './Placeholder/Placeholder';
import TorchComposition from './TorchComposition/TorchComposition';
import { type TarotSpreadProps } from './TartotSpread.props';
import styles from './TarotSpread.module.css';
import TextContainer from '@/shared/ui/TextContainer';

export const TarotSpread: FC<TarotSpreadProps> = (props) => {
  const { spread, onSpreadFinish, onInterpretationFinish } = props;

  const { title, id, cardsCount } = spread;

  const [step, setStep] = useState<'spread' | 'interpretation'>('spread');

  const navigate = useNavigate();

  const {
    cards,
    activeCard,
    isFinished,
    prepareCards,
    changeActiveCard,
    resetSpread,
  } = useReading();
  const {
    getInterpretation,
    interpretation = ['Thinking...'],
    isLoading,
    spreadId,
    error,
  } = useInterpretation({ onFinish: onInterpretationFinish });

  const { i18n } = useLocales();

  const { user } = useUser();

  const audio = new Audio('/assets/sfx/flip.mp3');

  const handleCardClick = () => {
    changeActiveCard();

    if (user?.audio) {
      audio.volume = 0.3;
      audio.play();
    }
  };

  const [rating, setRating] = useState(0);

  const { state, reset, proceed } = useBlocker(isLoading);

  const handleRatingInputChange = async (rate: number) => {
    setRating(rate);

    if (spreadId) {
      await updateSpread(spreadId, { rating: rate });
    }
  };

  const handleFinishButtonClick = () => {
    reset?.();

    setStep('interpretation');

    onSpreadFinish?.(spread, cards);
  };

  const handleModalClose = () => {
    reset?.();
  };

  const handleModalConfirm = () => {
    proceed?.();
  };

  const handleRetryButtonClick = () => {
    setStep('spread');

    prepareCards(cardsCount);

    resetSpread();

    if (cards.length) {
      getInterpretation(cards, spread);
    }
  };

  useEffect(() => {
    prepareCards(cardsCount);

    return () => {
      reset?.();
    };
  }, []);

  useEffect(() => {
    if (cards.length) {
      getInterpretation(cards, spread);
    }
  }, [cards.length]);

  if (error) {
    return <Error error={error} onRetryButtonClick={handleRetryButtonClick} />;
  }

  if (step === 'interpretation') {
    return (
      <div className={styles.tarotSpread}>
        <TorchComposition className={styles.torchComposition} />

        <h3 className={styles.title}>{title}</h3>

        <div className={styles['interpretation-container']}>
          <div className={`${styles['cards-small']} custom-scrollbar`}>
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
            paragraphs={interpretation ?? []}
            maxHeight={596}
            maxHeightMeasure={'px'}
            className={styles.interpretation}
          >
            <RatingInput className={styles.rating} value={rating} onChange={handleRatingInputChange} />
          </TextContainer>
        </div>

        <div className={styles.bottom}>
          <ArrowButton onClick={() => navigate('/')} />

          <Button onClick={() => navigate('/history')}>
            {i18n('To spreads history')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tarotSpread}>
      <TorchComposition className={styles.torchComposition} />

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

        {isFinished ? (
          <Button
            className={styles.button}
            onClick={handleFinishButtonClick}
            style={SpreadConfig[id].button}
          >
            {i18n('Interpretation')}
          </Button>
        ) : (
          <span
            className={styles.instruction}
            style={{
              ...SpreadConfig[id].button,
              right: 'calc(50% - 100px)',
              position: 'absolute',
            }}
          >
            {SpreadConfig[id].cards.length > 1
              ? i18n('Unfold cards one by one')
              : i18n('Unfold the card')}
          </span>
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
