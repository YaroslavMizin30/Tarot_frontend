import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useNavigate, useLocation, useParams } from 'react-router';

import useLocales from '@/shared/hooks/useLocales';
import TextContainer from '@/shared/ui/TextContainer';
import Button from '@/shared/ui/Button';
import TRANSLATIONS_HISTORY_EN from '@/shared/locales/en/history';
import TRANSLATIONS_HISTORY_RU from '@/shared/locales/ru/history';
import RatingInput from '@/shared/ui/RatingInput';
import Spinner from '@/shared/ui/Spinner';

import {
  DAILY_CARD_SPREAD_MARKER,
  type Spread,
  getSpreadById,
  rateSpread,
} from '@/entities/Spread';
import { queryKeys } from '@/shared/api/queryKeys';
import TarotCard from '@/entities/TarotCard';
import { SpreadConfig } from '@/features/TarotSpread/config/spreads';

import styles from './SpreadPage.module.css';

export const SpreadPage = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const { i18n, addTranslations } = useLocales();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const stateSpread = state as Spread | null;
  const hasStateSpread = stateSpread?.spreadId === id;
  const { data: loadedSpread, isLoading } = useQuery({
    queryKey: queryKeys.spreads.detail(id ?? 'missing'),
    queryFn: () => getSpreadById(id!),
    enabled: Boolean(id && !hasStateSpread),
  });
  const spread = hasStateSpread ? stateSpread : loadedSpread;

  const [ratingOverride, setRatingOverride] = useState<{
    spreadId: string;
    value: number;
  } | null>(null);
  const [isRatingSaving, setIsRatingSaving] = useState(false);
  const [ratingDebug, setRatingDebug] = useState<Record<string, unknown> | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const rate = ratingOverride && ratingOverride.spreadId === spread?.spreadId
    ? ratingOverride.value
    : spread?.rating;

  const handleRatingInputChange = async (value: number) => {
    if (!spread?.spreadId || isRatingSaving) return;

    const previousValue = rate;
    setRatingOverride({ spreadId: spread.spreadId, value });
    setIsRatingSaving(true);
    setRatingDebug({
      state: 'requesting',
      spreadId: spread.spreadId,
      requestedRating: value,
      previousRating: previousValue ?? null,
      clientTime: new Date().toISOString(),
    });

    try {
      const result = await rateSpread(spread.spreadId, value);
      setRatingDebug({
        state: result.spread ? 'response' : 'server-rejected',
        spreadId: spread.spreadId,
        response: result.debug,
      });

      if (!result.spread) {
        setRatingOverride(
          previousValue === undefined
            ? null
            : { spreadId: spread.spreadId, value: previousValue },
        );
        return;
      }

      const updatedSpread = result.spread;
      setRatingOverride({
        spreadId: spread.spreadId,
        value: updatedSpread.rating ?? value,
      });
      queryClient.setQueryData(
        queryKeys.spreads.detail(spread.spreadId),
        updatedSpread,
      );
      await queryClient.invalidateQueries({
        queryKey: queryKeys.spreads.all,
        refetchType: 'inactive',
      });
    } catch (error) {
      setRatingDebug({
        state: 'request-error',
        spreadId: spread.spreadId,
        error: error instanceof Error ? error.message : String(error),
      });
      setRatingOverride(
        previousValue === undefined
          ? null
          : { spreadId: spread.spreadId, value: previousValue },
      );
    } finally {
      setIsRatingSaving(false);
    }
  };

  useEffect(() => {
    addTranslations({
      en: { ...TRANSLATIONS_HISTORY_EN },
      ru: { ...TRANSLATIONS_HISTORY_RU },
    });
  }, [addTranslations]);

  if (isLoading && !spread) {
    return <Spinner size={'l'} />;
  }

  if (!spread) {
    return (
      <div className={styles.emptyState}>
        <p>{i18n('Spread not found')}</p>
        <Button onClick={() => navigate('/history')}>
          {i18n('To spreads history')}
        </Button>
      </div>
    );
  }

  const { interpretation, title, cards, question, date } = spread;
  const activeCard = cards[activeCardIndex];
  const activePosition = SpreadConfig[spread.id]?.cards[activeCardIndex]?.title;

  return (
    <div className={styles.tarotSpread}>
      <button
        className={styles.topBack}
        onClick={() => navigate(-1)}
        type={'button'}
      >
        <span aria-hidden={true}>←</span>
        {i18n('Back')}
      </button>

      <header className={styles.header}>
        <span className={styles.date}>{date}</span>
        <h3 className={styles.title}>
          {title === DAILY_CARD_SPREAD_MARKER ? i18n(title) : title}
        </h3>
        {question && <p className={styles.question}>{question}</p>}
      </header>

      <div className={styles['interpretation-container']}>
        <div className={`${styles.cards} custom-scrollbar`}>
          {cards.map((card, index) => {
            const { name, isInverted } = card;

            return (
              <button
                aria-pressed={activeCardIndex === index}
                className={`${styles.cardItem} ${activeCardIndex === index ? styles.cardItemActive : ''}`}
                key={`${name}-${index}`}
                onClick={() => setActiveCardIndex(index)}
                type={'button'}
              >
                <span className={styles.cardIndex}>{index + 1}</span>
                <TarotCard
                  size={'m'}
                  name={name}
                  localizedName={i18n(name)}
                  isInverted={isInverted}
                  className={styles.card}
                  hasLoadingState
                />
              </button>
            );
          })}
        </div>

        {activeCard && (
          <div className={styles.activeCardInfo} aria-live={'polite'}>
            <strong>{`${activeCardIndex + 1}. ${i18n(activeCard.name)}`}</strong>
            <div className={styles.activeCardMeta}>
              {activePosition && <span>{i18n(activePosition)}</span>}
              <span>
                {i18n(activeCard.isInverted ? 'Reversed position' : 'Upright position')}
              </span>
            </div>
          </div>
        )}

        <div className={styles.interpretationBlock}>
          <TextContainer
            format={'markdown'}
            paragraphs={interpretation.split('\n')}
            maxHeight={100}
            maxHeightMeasure={'%'}
            className={styles.interpretation}
          >
            <RatingInput
              className={styles.rating}
              value={rate ?? 0}
              onChange={handleRatingInputChange}
              disabled={isRatingSaving}
            />
            <pre className={styles.ratingDebug} aria-live={'polite'}>
              {JSON.stringify(
                ratingDebug ?? {
                  state: 'idle',
                  spreadId: spread.spreadId,
                  loadedRating: spread.rating ?? null,
                },
                null,
                2,
              )}
            </pre>
          </TextContainer>
        </div>
      </div>

    </div>
  );
};
