import { useRef, useState, useCallback } from 'react';

import useLocales from '@/shared/hooks/useLocales';
import PointerIcon from '@/shared/assets/svg/roulette/pointer.svg';
import Button from '@/shared/ui/Button';
import Spinner from '@/shared/ui/Spinner';

import Card from '@/entities/TarotCard';
import type { BonusGameMode } from '@/entities/BonusGame';

import { useRoulette } from '../../model/useRoulette';
import {
  animateCard,
  animateSpin,
  reverseCardAnimation,
} from '../../lib/animations';

import Effect from '../Effect/Effect';

import type { RouletteProps } from './Roulette.props';

import styles from './Roulette.module.css';

const DEGREES_PER_CARD = 30;
const FULL_ROTATION = 360;

const waitForNextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

const wait = (duration: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });

export const Roulette = (props: RouletteProps) => {
  const { onRulesButtonClick } = props;

  const rouletteRef = useRef<HTMLDivElement>(null);
  const lastSpinDegree = useRef<number>(0);
  const drawnCardIndex = useRef<number | null>(null);
  const isAnimating = useRef(false);

  const [animationState, setAnimationState] = useState<
    'idle' | 'spinning' | 'returning'
  >('idle');
  const [revealedCardIndex, setRevealedCardIndex] = useState<number | null>(
    null,
  );
  const [mode, setMode] = useState<BonusGameMode>('daily');

  const {
    playingCards,
    play,
    applyResultCards,
    revealResult,
    progress,
    bonusBalance,
    isLoading,
    isError,
    retry,
    dailyStatus,
    riskStatus,
  } = useRoulette();

  const isSpinDisabled = mode === 'daily'
    ? dailyStatus !== 'available'
    : riskStatus !== 'available';

  const { i18n } = useLocales();

  const findCardElements = useCallback((index: number) => {
    if (!rouletteRef.current) return null;

    const orbit = rouletteRef.current.querySelector(
      `[data-orbit-index="${index}"]`,
    ) as HTMLDivElement | null;
    const cardWrapper = rouletteRef.current.querySelector(
      `[data-card-index="${index}"]`,
    ) as HTMLDivElement | null;
    const card = cardWrapper?.firstElementChild as HTMLDivElement | null;
    if (orbit && cardWrapper && card) {
      return { orbit, cardWrapper, card };
    }

    return null;
  }, []);

  const reverseCard = async () => {
    if (drawnCardIndex.current !== null) {
      const index = drawnCardIndex.current;
      const elements = findCardElements(index);

      if (elements) {
        const { orbit, cardWrapper, card } = elements;

        await reverseCardAnimation(card);

        cardWrapper.style.transform = '';
        orbit.style.zIndex = '';
      }

      drawnCardIndex.current = null;
      setRevealedCardIndex(null);
    }
  };

  const handleReturnCard = async () => {
    if (drawnCardIndex.current === null || isAnimating.current) return;

    isAnimating.current = true;
    setAnimationState('returning');
    try {
      await reverseCard();
    } finally {
      isAnimating.current = false;
      setAnimationState('idle');
    }
  };

  const handleModeChange = (nextMode: BonusGameMode) => {
    if (nextMode === mode || isAnimating.current) return;
    setMode(nextMode);
  };

  const handleSpinButtonClick = async () => {
    if (isAnimating.current) return;

    isAnimating.current = true;
    setAnimationState('spinning');

    try {
      await reverseCard();

      const result = await play(mode);
      if (!result) return;

      const randomIndex = result.selectedIndex;
      drawnCardIndex.current = randomIndex;

      await waitForNextFrame();

      if (rouletteRef.current) {
        const cardDegree = randomIndex * DEGREES_PER_CARD;
        const n = Math.ceil(
          (lastSpinDegree.current + cardDegree) / FULL_ROTATION,
        );
        const targetRotation =
          1080 + FULL_ROTATION * n - cardDegree + 180;

        const spinAnimation = animateSpin(
          rouletteRef.current,
          lastSpinDegree.current,
          targetRotation,
        );

        // Replace the wheel only after it has gained speed, so the server
        // layout cannot appear as a static visual jump before the spin.
        await wait(240);
        applyResultCards(result);
        await waitForNextFrame();
        await spinAnimation;

        lastSpinDegree.current = targetRotation;

        const elements = findCardElements(randomIndex);

        if (elements) {
          const { orbit, cardWrapper, card } = elements;

          orbit.style.zIndex = '1';

          // The wheel target puts the selected orbit exactly 180° from its
          // resting bottom position, directly under the top pointer. Keep the
          // orbit unchanged and only counter-rotate the card content upright.
          cardWrapper.style.transform = 'rotate(180deg)';

          await animateCard(card);
          setRevealedCardIndex(randomIndex);
        }
      }

      await revealResult(result, mode);
    } finally {
      isAnimating.current = false;
      setAnimationState('idle');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading} aria-live={'polite'}>
        <Spinner size={'l'} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`${styles.loading} ${styles.errorState}`}>
        <p>{i18n('Could not load bonus game')}</p>
        <Button onClick={retry}>{i18n('Try again')}</Button>
      </div>
    );
  }

  const revealedCard = revealedCardIndex === null
    ? null
    : playingCards[revealedCardIndex];

  return (
    <div className={styles.container}>
      <div className={styles.switcher} role={'tablist'}>
        <button
          type={'button'}
          role={'tab'}
          aria-selected={mode === 'daily'}
          className={`${styles.switcherButton} ${
            mode === 'daily' ? styles.switcherButtonActive : ''
          }`}
          onClick={() => handleModeChange('daily')}
          disabled={animationState !== 'idle'}
        >
          {i18n('Free card')}
        </button>
        <button
          type={'button'}
          role={'tab'}
          aria-selected={mode === 'risk'}
          className={`${styles.switcherButton} ${
            mode === 'risk' ? styles.switcherButtonActive : ''
          }`}
          onClick={() => handleModeChange('risk')}
          disabled={animationState !== 'idle'}
        >
          {i18n('Try your luck')}
        </button>
      </div>

      <div className={styles.message}>
        <span>
          {i18n(mode === 'daily'
            ? dailyStatus === 'available'
              ? 'Your daily card is ready'
              : 'Your daily card has already been opened'
            : riskStatus === 'daily_card_required'
              ? 'Open your daily card first'
              : riskStatus === 'insufficient_bonus'
                ? 'You need 1 bonus pentacle'
                : riskStatus === 'already_played'
                  ? 'You have already tried your luck today'
                  : 'Stake 1 bonus pentacle. Possible payout: 0–4')}
        </span>
        <span className={styles.balance}>
          {i18n('Bonus balance')}: {bonusBalance}
        </span>
        <span className={styles.progress}>
          {mode === 'daily'
            ? `${i18n('Guaranteed reward')}: ${progress}/4`
            : i18n('Purchased balance is never used')}
        </span>
      </div>

      <div className={styles.rouletteStage}>
        <div className={styles.roulette} ref={rouletteRef}>
          <div className={styles.line}></div>
          <div className={styles.line} style={{ transform: 'rotate(30deg)' }} />
          <div className={styles.line} style={{ transform: 'rotate(60deg)' }} />
          <div className={styles.line} style={{ transform: 'rotate(90deg)' }} />
          <div className={styles.line} style={{ transform: 'rotate(120deg)' }} />
          <div className={styles.line} style={{ transform: 'rotate(150deg)' }} />

          {playingCards?.map((card, index) => {
            const { id, effect } = card;

            return (
              <div
                className={`${styles.orbit}`}
                style={{
                  transform: `rotate(${index * 30 - 15}deg)`,
                }}
                key={id}
                data-orbit-index={index}
              >
                <Effect
                  effect={effect}
                  className={`${styles.effect} ${styles[`effect-${effect}`]}`}
                />

                <div
                  data-card-index={index}
                  className={
                    revealedCardIndex === index ? styles.revealedCard : ''
                  }
                  role={revealedCardIndex === index ? 'button' : undefined}
                  tabIndex={revealedCardIndex === index ? 0 : undefined}
                  aria-label={
                    revealedCardIndex === index
                      ? i18n('Return card to the wheel')
                      : undefined
                  }
                  onClick={
                    revealedCardIndex === index
                      ? handleReturnCard
                      : undefined
                  }
                  onKeyDown={
                    revealedCardIndex === index
                      ? (event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleReturnCard();
                        }
                      }
                      : undefined
                  }
                >
                  <Card
                    className={`${styles.card} ${effect ? styles[`card-${effect}`] : ''}`}
                    name={id}
                    size={'xs'}
                    localizedName={i18n(id)}
                  />
                </div>

              </div>
            );
          })}

          <div className={styles['roulette-inner']}></div>
          <div className={styles['roulette-outer']}></div>
          <div className={styles['inner-circle']}>
            <div className={styles.line} style={{ transform: 'rotate(15deg)' }} />
            <div className={styles.line} style={{ transform: 'rotate(45deg)' }} />
            <div className={styles.line} style={{ transform: 'rotate(75deg)' }} />
            <div
              className={styles.line}
              style={{ transform: 'rotate(105deg)' }}
            />
            <div
              className={styles.line}
              style={{ transform: 'rotate(135deg)' }}
            />
            <div
              className={styles.line}
              style={{ transform: 'rotate(165deg)' }}
            />
          </div>
        </div>

        <div className={styles.pointer}>
          <div className={styles['pointer-light-out']}></div>

          <div className={styles['pointer-light']}></div>

          <PointerIcon className={styles['pointer-icon']} />
        </div>

        {revealedCard && (
          <span className={styles.resultDescription}>
            <span
              className={`${styles['effect-shadow']} ${
                revealedCard.effect
                  ? styles[`shadow-${revealedCard.effect}`]
                  : ''
              }`}
            />
            {i18n(
              revealedCard.description ?? 'This card has no effects',
            )}
          </span>
        )}
      </div>

      <div className={styles.returnSlot}>
        <button
          type={'button'}
          className={styles.returnButton}
          onClick={handleReturnCard}
          disabled={
            revealedCardIndex === null || animationState !== 'idle'
          }
          aria-hidden={revealedCardIndex === null}
        >
          {i18n('Tap the card to return it')}
        </button>
      </div>

      <div className={styles.menu}>
        <Button
          className={styles.button}
          onClick={handleSpinButtonClick}
          isLoading={animationState === 'spinning'}
          disabled={isSpinDisabled}
        >
          {i18n(mode === 'daily' ? 'Open card' : 'Try for 1 pentacle')}
        </Button>

        <Button className={styles.button} onClick={onRulesButtonClick}>
          {i18n('Rules')}
        </Button>
      </div>
    </div>
  );
};
