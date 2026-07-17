import { useEffect, useState, type FC } from 'react';

import { useBlocker, useNavigate } from 'react-router';

import Button from '@/shared/ui/Button';
import Modal from '@/shared/ui/Modal';
import useLocales from '@/shared/hooks/useLocales';
import Error from '@/shared/ui/Error';

import TarotCard from '@/entities/TarotCard';
import { useUser } from '@/entities/User';
import { getTodayString } from '@/shared/utils/getTodayString';

import { SpreadConfig } from '../config/spreads';
import { useReading } from '../model/hooks/useReading/useReading';
import { useInterpretation } from '../model/hooks/useInterpretation/useInterpretation';

import Placeholder from './Placeholder/Placeholder';
import { type TarotSpreadProps } from './TartotSpread.props';
import styles from './TarotSpread.module.css';

export const TarotSpread: FC<TarotSpreadProps> = (props) => {
  const { spread, onSpreadFinish, onInterpretationFinish } = props;

  const { title, id, cardsCount } = spread;

  const navigate = useNavigate();

  const {
    cards,
    activeCard,
    isFinished,
    prepareCards,
    changeActiveCard,
    revealAllCards,
    resetSpread,
  } = useReading();
  const { getInterpretation, interpretation, isLoading, spreadId, error } =
    useInterpretation({ onFinish: onInterpretationFinish });

  const { i18n } = useLocales();

  const { user } = useUser();

  const audio = new Audio('/assets/sfx/flip.mp3');

  // State to track pending navigation after interpretation finishes
  const [pendingNavigation, setPendingNavigation] = useState(false);

  // Navigate when interpretation finishes while waiting
  useEffect(() => {
    if (pendingNavigation && interpretation && spreadId) {
      navigate(`/history/${spreadId}`, {
        state: {
          ...spread,
          cards,
          interpretation: interpretation.join('\n'),
          date: getTodayString(),
          spreadId,
        },
      });
    }
  }, [pendingNavigation, interpretation, spreadId]);

  const handleCardClick = () => {
    changeActiveCard();

    if (user?.audio) {
      audio.volume = 0.3;
      audio.play();
    }
  };

  const { state, reset, proceed } = useBlocker(({ nextLocation }) => {
    if (nextLocation.pathname.includes('/history/')) {
      return false;
    }

    return isLoading;
  });

  const handleFinishButtonClick = () => {
    reset?.();

    onSpreadFinish?.(spread, cards);

    if (interpretation && spreadId) {
      navigate(`/history/${spreadId}`, {
        state: {
          ...spread,
          cards,
          interpretation: interpretation.join('\n'),
          date: getTodayString(),
          spreadId,
        },
      });
    } else {
      setPendingNavigation(true);
    }
  };

  const handleModalClose = () => {
    reset?.();
  };

  const handleModalConfirm = () => {
    proceed?.();
  };

  const handleRetryButtonClick = () => {
    prepareCards(cardsCount);

    resetSpread();

    if (cards.length) {
      getInterpretation(
        cards,
        spread,
        spread.spreadId ? { spreadId: spread.spreadId } : undefined,
      );
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
      getInterpretation(
        cards,
        spread,
        spread.spreadId ? { spreadId: spread.spreadId } : undefined,
      );
    }
  }, [cards.length]);

  if (error) {
    return <Error error={error} onRetryButtonClick={handleRetryButtonClick} />;
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
                size={'l'}
                className={`${styles.card} ${count === activeCard && styles['active-card']}`}
                style={{
                  animationDelay: `${count}s`,
                  animationFillMode: 'forwards',
                }}
                isInverted={isInverted}
                onClick={handleCardClick}
                canTurnOver={!isFinished && count === activeCard}
                isReversed={!isFinished}
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
          <Button
            className={styles.button}
            onClick={revealAllCards}
            style={{
              ...SpreadConfig[id].button,
            }}
          >
            {SpreadConfig[id].cards.length > 1
              ? i18n('Reveal all cards')
              : i18n('Reveal card')}
          </Button>
        )}
      </div>

      {/* Loading overlay when waiting for interpretation before navigation */}
      {pendingNavigation && (
        <Modal
          onClose={handleModalClose}
          isOpen={true}
          className={styles.modal}
          isClosable={false}
        >
          {i18n('Interpreting')}...
        </Modal>
      )}

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
