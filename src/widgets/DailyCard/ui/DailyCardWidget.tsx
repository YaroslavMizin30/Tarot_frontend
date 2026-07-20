import { useEffect, useState } from 'react';

import TarotCard, { getCardInfoI18n } from '@/entities/TarotCard';
import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/daily';
import TRANSLATIONS_RU from '@/shared/locales/ru/daily';
import Button from '@/shared/ui/Button';
import GlassLoader from '@/shared/ui/GlassLoader';
import Modal from '@/shared/ui/Modal';
import { getTodayString } from '@/shared/utils/getTodayString';
import { getNextMidnight } from '@/shared/utils/getNextMidnight';

import { useDailyCard } from '../model/useDailyCard';
import styles from './DailyCardWidget.module.css';

interface DailyCardContentProps {
  areTranslationsReady: boolean;
  dayKey: string;
  onReady?: () => void;
}

const DailyCardContent = ({
  areTranslationsReady,
  dayKey,
  onReady,
}: DailyCardContentProps) => {
  const { i18n } = useLocales();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const {
    card,
    hasDataError,
    hasRevealSaveError,
    interpretation,
    interpretationError,
    isBooting,
    isRevealed,
    retryInterpretation,
    retryData,
    retryRevealSave,
    revealCard,
  } = useDailyCard(dayKey, areTranslationsReady);

  const cardInfo = card ? getCardInfoI18n(card.name, i18n) : undefined;
  const isInterpretationPending =
    isRevealed && interpretation.length === 0 && !interpretationError;
  const canShowDetails =
    isRevealed && interpretation.length > 0 && Boolean(cardInfo);

  useEffect(() => {
    if (!isBooting || hasDataError) {
      onReady?.();
    }
  }, [hasDataError, isBooting, onReady]);

  if (isBooting && !hasDataError) {
    return (
      <section
        aria-busy={'true'}
        aria-label={i18n('Card of the day')}
        className={styles.widget}
      >
        <div className={styles.hero}>
          <div aria-hidden={'true'} className={styles.summaryPlaceholder}>
            <span />
            <span />
            <span />
          </div>

          <div className={styles.cardColumn}>
            <div className={styles.cardPlaceholder}>
              <GlassLoader />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.widget} aria-labelledby={'daily-card-title'}>
      <div className={styles.hero}>
        <div className={styles.summary}>
          <span className={styles.eyebrow}>{i18n('Card of the day')}</span>

          <h1 id={'daily-card-title'} className={styles.title}>
            {isRevealed && cardInfo
              ? cardInfo.name
              : i18n('Your message for today is hidden')}
          </h1>

          {isRevealed && cardInfo ? (
            <>
              <p className={styles.meaning}>{cardInfo.meanings}</p>

              {card?.isInverted && (
                <span className={styles.orientation}>
                  {i18n('Reversed card')}
                </span>
              )}
            </>
          ) : (
            <p className={styles.hiddenHint}>{i18n('Unfold the card')}</p>
          )}

          <div className={styles.actions}>
            {hasDataError ? (
              <Button className={styles.actionButton} onClick={retryData}>
                {i18n('Try again')}
              </Button>
            ) : !isBooting && hasRevealSaveError ? (
              <Button
                className={styles.actionButton}
                onClick={retryRevealSave}
              >
                {i18n('Try again')}
              </Button>
            ) : !isBooting && !isRevealed ? (
              <Button className={styles.actionButton} onClick={revealCard}>
                {i18n('Reveal card')}
              </Button>
            ) : isInterpretationPending ? (
              <span className={styles.pending}>{i18n('Interpreting')}…</span>
            ) : interpretationError ? (
              <Button
                className={styles.actionButton}
                onClick={retryInterpretation}
              >
                {i18n('Try again')}
              </Button>
            ) : canShowDetails ? (
              <Button
                className={styles.detailsButton}
                onClick={() => setIsDetailsOpen(true)}
              >
                {i18n('About this card')}
              </Button>
            ) : null}
          </div>
        </div>

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
              hasBackShimmer={!isRevealed}
            />
          )}

        </div>
      </div>

      {cardInfo && canShowDetails && (
        <Modal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          isClosable={false}
          overlayClassName={styles.detailsOverlay}
          className={styles.detailsScreen}
          contentClassName={`${styles.detailsContent} custom-scrollbar`}
        >
          <header className={styles.detailsHeader}>
            <button
              type={'button'}
              className={styles.backButton}
              onClick={() => setIsDetailsOpen(false)}
            >
              <span aria-hidden={'true'}>←</span>
              {i18n('Back')}
            </button>
          </header>

          <div className={styles.detailsBody}>
            <span className={styles.sheetEyebrow}>
              {i18n('Card of the day')}
            </span>
            <h2 className={styles.sheetTitle}>{cardInfo.name}</h2>

            {card?.isInverted && (
              <span className={styles.sheetOrientation}>
                {i18n('Reversed card')}
              </span>
            )}

            <section className={styles.detailsSection}>
              <h3>{i18n('Daily interpretation')}</h3>
              {interpretation.map((paragraph, index) => (
                <p key={`${paragraph}-${index}`}>{paragraph}</p>
              ))}
            </section>

            <section className={styles.detailsSection}>
              <h3>{i18n('Card meaning')}</h3>
              <p>{cardInfo.meanings}</p>
              <p>{cardInfo.description}</p>
            </section>
          </div>
        </Modal>
      )}
    </section>
  );
};

interface DailyCardWidgetProps {
  onReady?: () => void;
}

export const DailyCardWidget = ({ onReady }: DailyCardWidgetProps) => {
  const { addTranslations, locale, translations } = useLocales();
  const [dayKey, setDayKey] = useState(getTodayString);

  const translationsForLocale =
    locale === 'ru' ? TRANSLATIONS_RU : TRANSLATIONS_EN;
  const areTranslationsReady =
    translations['Need tarot spread interpretation'] ===
    translationsForLocale['Need tarot spread interpretation'];

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [addTranslations]);

  useEffect(() => {
    const nextMidnight = getNextMidnight(new Date());

    if (!nextMidnight) {
      return;
    }

    const delay = Math.max(nextMidnight.getTime() - Date.now() + 250, 250);
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
      onReady={onReady}
    />
  );
};
