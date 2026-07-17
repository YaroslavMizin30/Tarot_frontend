import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import TarotCard from '@/entities/TarotCard';
import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/daily';
import TRANSLATIONS_RU from '@/shared/locales/ru/daily';
import Button from '@/shared/ui/Button';
import GlassLoader from '@/shared/ui/GlassLoader';
import { getTodayString } from '@/shared/utils/getTodayString';
import { getNextMidnight } from '@/shared/utils/getNextMidnight';

import { useDailyCard } from '../model/useDailyCard';
import { DailyCardTimer } from './DailyCardTimer';

import styles from './DailyCardWidget.module.css';

interface DailyCardContentProps {
  areTranslationsReady: boolean;
  dayKey: string;
  onTimerFinish: () => void;
}

const DailyCardContent = ({
  areTranslationsReady,
  dayKey,
  onTimerFinish,
}: DailyCardContentProps) => {
  const { i18n } = useLocales();
  const {
    card,
    hasDataError,
    hasRevealSaveError,
    interpretation,
    interpretationError,
    isBooting,
    isRevealed,
    nextAvailableAt,
    retryInterpretation,
    retryData,
    retryRevealSave,
    revealCard,
  } = useDailyCard(dayKey, areTranslationsReady);

  const isInterpretationPending =
    isRevealed && interpretation.length === 0 && !interpretationError;

  return (
    <section className={styles.widget} aria-labelledby={'daily-card-title'}>
      <h2 id={'daily-card-title'} className={styles.title}>
        {i18n('Card of the day')}
      </h2>

      <div className={styles.content}>
        <div className={styles.cardColumn}>
          {isBooting || !card ? (
            <div className={styles.cardPlaceholder}>
              <GlassLoader />
            </div>
          ) : (
            <TarotCard
              key={dayKey}
              name={card.name}
              localizedName={i18n(card.name)}
              isInverted={card.isInverted}
              isReversed={!isRevealed}
              canTurnOver={!isRevealed}
              onClick={revealCard}
              size={'l'}
              hasLoadingState
            />
          )}

          <div className={styles.timerSlot}>
            {hasDataError ? (
              <Button
                className={styles.timerRetryButton}
                onClick={retryData}
              >
                {i18n('Try again')}
              </Button>
            ) : !isBooting && hasRevealSaveError ? (
              <Button
                className={styles.timerRetryButton}
                onClick={retryRevealSave}
              >
                {i18n('Try again')}
              </Button>
            ) : !isBooting && isRevealed && nextAvailableAt ? (
              <DailyCardTimer
                targetDate={nextAvailableAt}
                onFinish={onTimerFinish}
              />
            ) : !isBooting && !isRevealed ? (
              <span className={styles.revealHint}>
                {i18n('Unfold the card')}
              </span>
            ) : null}
          </div>
        </div>

        <div
          className={`${styles.interpretationPanel} ${isRevealed && !isBooting ? styles.interpretationPanelVisible : ''}`}
          aria-busy={isInterpretationPending}
          aria-hidden={!isRevealed}
        >
          {!isBooting && isInterpretationPending && <GlassLoader />}

          {!isBooting && isRevealed && interpretation.length > 0 && (
            <div
              className={`${styles.interpretationText} custom-scrollbar`}
            >
              {interpretation.map((paragraph, index) => (
                <p key={`${paragraph}-${index}`}>{paragraph}</p>
              ))}
            </div>
          )}

          {!isBooting && isRevealed && interpretationError && (
            <div className={styles.interpretationError}>
              <span>{interpretationError}</span>
              <Button
                className={styles.retryButton}
                onClick={retryInterpretation}
              >
                {i18n('Try again')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export const DailyCardWidget = () => {
  const {
    addTranslations,
    locale,
    translations,
  } = useLocales();
  const [dayKey, setDayKey] = useState(getTodayString);

  const translationsForLocale =
    locale === 'ru' ? TRANSLATIONS_RU : TRANSLATIONS_EN;
  const areTranslationsReady =
    translations['Need tarot spread interpretation'] ===
    translationsForLocale['Need tarot spread interpretation'];

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [addTranslations]);

  const handleTimerFinish = useCallback(() => {
    setDayKey(getTodayString());
  }, []);

  useEffect(() => {
    const nextMidnight = getNextMidnight(new Date());

    if (!nextMidnight) {
      return;
    }

    const delay = Math.max(
      nextMidnight.getTime() - Date.now() + 250,
      250,
    );
    const timeoutId = window.setTimeout(() => {
      setDayKey(getTodayString());
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [dayKey]);

  return (
    <DailyCardContent
      key={dayKey}
      areTranslationsReady={areTranslationsReady}
      dayKey={dayKey}
      onTimerFinish={handleTimerFinish}
    />
  );
};
