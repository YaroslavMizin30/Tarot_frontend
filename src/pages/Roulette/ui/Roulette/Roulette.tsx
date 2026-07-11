import { useRef, useState, useCallback } from 'react';

import useLocales from '@/shared/hooks/useLocales';
import PointerIcon from '@/shared/assets/svg/roulette/pointer.svg';
import Button from '@/shared/ui/Button';
import Spinner from '@/shared/ui/Spinner';

import Card from '@/entities/TarotCard';

import { useRoulette } from '../../model/useRoulette';
import {
  animateCard,
  animateSpin,
  animateShuffle,
  reverseCardAnimation,
} from '../../lib/animations';

import Effect from '../Effect/Effect';

import type { RouletteProps } from './Roulette.props';

import styles from './Roulette.module.css';

const CARD_COUNT = 12;
const DEGREES_PER_CARD = 30;
const FULL_ROTATION = 360;

const waitForNextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

export const Roulette = (props: RouletteProps) => {
  const { onRulesButtonClick } = props;

  const rouletteRef = useRef<HTMLDivElement>(null);
  const lastSpinDegree = useRef<number>(0);
  const drawnCardIndex = useRef<number | null>(null);
  const isAnimating = useRef(false);

  const [animationState, setAnimationState] = useState<
    'idle' | 'spinning' | 'shuffling'
  >('idle');

  const {
    playingCards,
    prepareCards,
    winDaysPast,
    isLoading,
    isSpinDisabled,
    isShuffleDisabled,
    updateRoulette,
  } = useRoulette();

  const { i18n } = useLocales();

  const findCardElements = useCallback((index: number) => {
    if (!rouletteRef.current) return null;

    const orbit = rouletteRef.current.querySelector(
      `[data-orbit-index="${index}"]`,
    ) as HTMLDivElement | null;
    const card = rouletteRef.current.querySelector(
      `[data-card-index="${index}"]`,
    ) as HTMLDivElement | null;
    const description = rouletteRef.current.querySelector(
      `[data-description-index="${index}"]`,
    ) as HTMLSpanElement | null;

    if (orbit && card && description) {
      return { orbit, card, description };
    }

    return null;
  }, []);

  const reverseCard = async () => {
    if (drawnCardIndex.current !== null) {
      const index = drawnCardIndex.current;
      const elements = findCardElements(index);

      if (elements) {
        const { orbit, card, description } = elements;

        orbit.style.transform = `rotate(${index * DEGREES_PER_CARD - 15}deg)`;
        orbit.style.zIndex = '';
        description.style.opacity = '0';

        // Remove counter-rotation so card returns to its natural orientation
        const cardWrapper = rouletteRef.current?.querySelector(
          `[data-card-index="${index}"]`,
        ) as HTMLDivElement | null;
        if (cardWrapper) {
          cardWrapper.style.transform = '';
        }

        await reverseCardAnimation(card);
      }

      drawnCardIndex.current = null;
    }
  };

  const handleShuffleButtonClick = async () => {
    if (isAnimating.current) return;

    isAnimating.current = true;
    setAnimationState('shuffling');

    try {
      await reverseCard();

      if (rouletteRef.current) {
        await animateShuffle(rouletteRef.current, async () => {
          await prepareCards();
          await waitForNextFrame();
        }, lastSpinDegree.current);

        lastSpinDegree.current = 0;
      }
    } finally {
      isAnimating.current = false;
      setAnimationState('idle');
    }
  };

  const handleSpinButtonClick = async () => {
    if (isAnimating.current) return;

    isAnimating.current = true;
    setAnimationState('spinning');

    try {
      await reverseCard();

      const randomIndex = Math.floor(Math.random() * CARD_COUNT);
      drawnCardIndex.current = randomIndex;

      await waitForNextFrame();

      if (rouletteRef.current) {
        const elements = findCardElements(randomIndex);

        if (elements) {
          const { orbit, card, description } = elements;

          // Calculate rotation so the selected card ends up at the pointer (top)
          // Card is at position `randomIndex * 30` degrees on the wheel.
          // Need: (wheelRotation + cardPosition) % 360 === 0 (top/pointer)
          // wheelRotation = animationTarget + 15 (CSS transform)
          // So: (targetRotation + 15 + randomIndex * 30 - 15) % 360 === 0
          // Simplified: (targetRotation + randomIndex * 30) % 360 === 0
          // targetRotation = 360 * n - randomIndex * 30
          // n is chosen so targetRotation >= lastSpinDegree + 1080 (at least 3 full spins)
          const cardDegree = randomIndex * DEGREES_PER_CARD;
          const n = Math.ceil(
            (lastSpinDegree.current + cardDegree) / FULL_ROTATION,
          );
          const targetRotation =
            1080 + FULL_ROTATION * n - cardDegree + 180;

          await animateSpin(
            rouletteRef.current,
            lastSpinDegree.current,
            targetRotation,
          );

          lastSpinDegree.current = targetRotation;

          orbit.style.transform = `rotate(${FULL_ROTATION / 2 + cardDegree - 15}deg)`;
          orbit.style.zIndex = '1';
          description.style.opacity = '1';

          // Counter-rotate the card wrapper so the card stays right-side up
          // (orbit is rotated 180°, which would flip the card upside down)
          const cardWrapper = rouletteRef.current?.querySelector(
            `[data-card-index="${randomIndex}"]`,
          ) as HTMLDivElement | null;
          if (cardWrapper) {
            cardWrapper.style.transform = 'rotate(180deg)';
          }

          await animateCard(card);

          // Win only if card has a positive effect (not undefined, not negative, not retry)
          const currentCard = playingCards?.[randomIndex];
          const hasWon =
            !!currentCard?.effect &&
            currentCard.effect !== 'negative' &&
            currentCard.effect !== 'retry';

          await updateRoulette(playingCards, hasWon);
        }
      }
    } finally {
      isAnimating.current = false;
      setAnimationState('idle');
    }
  };

  const getFreePhraze = () => {
    const term =
      winDaysPast === 0 ? i18n('today') : `${winDaysPast} ${i18n('days ago')}`;

    switch (true) {
      case winDaysPast < 7:
        return `${i18n('You won')} ${term}. ${i18n('Next game is available in')} ${7 - winDaysPast}`;
      case isSpinDisabled:
        return i18n(
          "You've spined the wheel today. You can shuffle to spin again.",
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return <Spinner size={'l'} />;
  }

  return (
    <div className={styles.container}>
      <span className={styles.message}>{getFreePhraze()}</span>

      <div className={styles.roulette} ref={rouletteRef}>
        <div className={styles.line}></div>
        <div className={styles.line} style={{ transform: 'rotate(30deg)' }} />
        <div className={styles.line} style={{ transform: 'rotate(60deg)' }} />
        <div className={styles.line} style={{ transform: 'rotate(90deg)' }} />
        <div className={styles.line} style={{ transform: 'rotate(120deg)' }} />
        <div className={styles.line} style={{ transform: 'rotate(150deg)' }} />

        {playingCards?.map((card, index) => {
          const { id, effect, description } = card;

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

              <div data-card-index={index}>
                <Card
                  className={`${styles.card} ${effect ? styles[`card-${effect}`] : ''}`}
                  name={id}
                  size={'xs'}
                  localizedName={i18n(id)}
                />
              </div>

              <span
                className={styles['card-effect']}
                data-description-index={index}
              >
                <div
                  className={`${styles['effect-shadow']} ${effect ? styles[`shadow-${effect}`] : ''}`}
                />
                {i18n(description ?? 'This card has no effects')}
              </span>
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

      <div className={styles.description}>
        {i18n(
          'For those who like excitement. Reading rules is highly recommended - effect may be unexpected',
        )}
      </div>

      <div className={styles.pointer}>
        <div className={styles['pointer-light-out']}></div>

        <div className={styles['pointer-light']}></div>

        <PointerIcon className={styles['pointer-icon']} />
      </div>

      <div className={styles.menu}>
        <Button
          className={`${styles.button} ${animationState === 'shuffling' ? styles.disabled : ''}`}
          onClick={handleSpinButtonClick}
          isLoading={animationState === 'spinning'}
          disabled={isSpinDisabled}
        >
          {i18n('Spin')}
        </Button>

        <Button
          className={`${styles.button} ${animationState === 'spinning' ? styles.disabled : ''}`}
          onClick={handleShuffleButtonClick}
          isLoading={animationState === 'shuffling'}
          disabled={isShuffleDisabled}
        >
          {i18n('Shuffle')}
        </Button>

        <Button className={styles.button} onClick={onRulesButtonClick}>
          {i18n('Rules')}
        </Button>
      </div>
    </div>
  );
};
