import { useEffect, useState, type CSSProperties, type FC } from 'react';

import { useBlocker, useNavigate } from 'react-router';

import Button from '@/shared/ui/Button';
import Modal from '@/shared/ui/Modal';
import useLocales from '@/shared/hooks/useLocales';
import Error from '@/shared/ui/Error';

import TarotCard from '@/entities/TarotCard';
import type { Card } from '@/entities/TarotCard';
import { useUser } from '@/entities/User';
import {
  finalizeSpreadDraft,
  selectSpreadCard,
  SpreadType,
} from '@/entities/Spread';
import { BILLING_REDIRECT_STATE_KEY } from '@/features/Billing/model/useBalance';
import { getTodayString } from '@/shared/utils/getTodayString';

import { SpreadConfig } from '../config/spreads';
import { useInterpretation } from '../model/hooks/useInterpretation/useInterpretation';

import Placeholder from './Placeholder/Placeholder';
import { type TarotSpreadProps } from './TartotSpread.props';
import styles from './TarotSpread.module.css';

export const TarotSpread: FC<TarotSpreadProps> = (props) => {
  const { spread, onSpreadFinish, onInterpretationFinish } = props;

  const { title, id, cardsCount } = spread;
  const isHorseshoeLayout = id === SpreadType.HORSESHOE;
  const isCelticCrossLayout = id === SpreadType.CELTIC_CROSS;
  const isCompactLayout = isHorseshoeLayout || isCelticCrossLayout;

  const navigate = useNavigate();

  const [cards, setCards] = useState<Card[]>(
    spread.status === 'charged' ? spread.cards ?? [] : [],
  );
  const [selectedCount, setSelectedCount] = useState(
    spread.selectedCount ?? 0,
  );
  const [selectedIndices, setSelectedIndices] = useState<number[]>(
    spread.selectedIndices ?? [],
  );
  const [activeCard, setActiveCard] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const { getInterpretation, interpretation, isLoading, spreadId, error } =
    useInterpretation({ onFinish: onInterpretationFinish });

  const { i18n } = useLocales();

  const { user, refetchUser } = useUser();

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
    setActiveCard((current) => current + 1);
    if (activeCard === cards.length) setIsFinished(true);

    if (user?.audio) {
      audio.volume = 0.3;
      audio.play();
    }
  };

  const handleSelectCard = async (index: number) => {
    if (!spread.spreadId || isSelecting) return;
    setIsSelecting(true);
    setSelectionError(null);
    try {
      const result = await selectSpreadCard(spread.spreadId, { index });
      setSelectedCount(result.selectedCount);
      setSelectedIndices(result.selectedIndices);
    } catch {
      setSelectionError(i18n('Unable to select card'));
    } finally {
      setIsSelecting(false);
    }
  };

  const handleAutoFill = async () => {
    if (!spread.spreadId || isSelecting) return;
    setIsSelecting(true);
    setSelectionError(null);
    try {
      const result = await selectSpreadCard(spread.spreadId, { autoFill: true });
      setSelectedCount(result.selectedCount);
      setSelectedIndices(result.selectedIndices);
    } catch {
      setSelectionError(i18n('Unable to select card'));
    } finally {
      setIsSelecting(false);
    }
  };

  const handleFinalize = async () => {
    if (!spread.spreadId || isSelecting) return;
    setIsSelecting(true);
    setSelectionError(null);
    try {
      const result = await finalizeSpreadDraft(spread.spreadId);
      if (result.status === 'insufficient_balance') {
        navigate('/billing', {
          state: {
            [BILLING_REDIRECT_STATE_KEY]: {
              current: result.current,
              draftId: result.draftId,
              required: result.required,
              returnTo: `/tarot?draft=${result.draftId}`,
            },
          },
        });
        return;
      }
      setCards(result.spread.cards);
      await refetchUser();
    } catch {
      setSelectionError(i18n('Unable to prepare spread'));
    } finally {
      setIsSelecting(false);
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
    if (cards.length) {
      getInterpretation(
        cards,
        spread,
        spread.spreadId ? { spreadId: spread.spreadId } : undefined,
      );
    }
  };

  useEffect(() => () => reset?.(), []);

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

  if (!cards.length) {
    const availableCards = Array.from({ length: 12 }, (_, index) => index);
    const isSelectionComplete = selectedCount >= cardsCount;

    return (
      <div className={styles.selection}>
        <span className={styles.selectionEyebrow}>
          {selectedCount} / {cardsCount}
        </span>
        <h3>{i18n(isSelectionComplete ? 'Cards are selected' : 'Choose a card')}</h3>
        <p>{i18n(isSelectionComplete
          ? 'Your selection is saved'
          : 'Focus on your question and choose the card that draws you')}</p>

        <div
          className={styles.selectedCards}
          aria-label={i18n('Selected cards')}
          style={{ '--selected-card-count': cardsCount } as CSSProperties}
        >
          {Array.from({ length: cardsCount }, (_, index) => (
            <span
              className={`${styles.selectedCardSlot} ${index < selectedCount ? styles.selectedCardSlotFilled : ''}`}
              key={index}
            />
          ))}
        </div>

        <div className={styles.deck}>
          {availableCards.map((index) => (
            <button
              aria-label={`${i18n('Choose card')} ${index + 1}`}
              className={`${styles.deckCard} ${selectedIndices.includes(index) ? styles.deckCardSelected : ''}`}
              disabled={selectedIndices.includes(index) || isSelecting || isSelectionComplete}
              key={index}
              onClick={() => handleSelectCard(index)}
              style={{ '--deck-index': index } as CSSProperties}
              type={'button'}
            />
          ))}
        </div>

        {selectionError && <p className={styles.selectionError}>{selectionError}</p>}

        <div className={styles.selectionActions}>
          {selectedCount > 0 && !isSelectionComplete && (
            <button disabled={isSelecting} onClick={handleAutoFill} type={'button'}>
              {i18n('Select the rest automatically')}
            </button>
          )}
          {isSelectionComplete && (
            <Button isLoading={isSelecting} onClick={handleFinalize}>
              {i18n('Lay out cards')}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tarotSpread}>
      <h3 className={styles.title}>{title}</h3>

      <div className={`${styles.cards} ${isCompactLayout ? styles.compactCards : ''} ${isHorseshoeLayout ? styles.horseshoeCards : ''} ${isCelticCrossLayout ? styles.celticCrossCards : ''}`}>
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
                size={isCelticCrossLayout ? 's' : isCompactLayout ? 'm' : 'l'}
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
            onClick={() => {
              setActiveCard(cards.length + 1);
              setIsFinished(true);
            }}
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
