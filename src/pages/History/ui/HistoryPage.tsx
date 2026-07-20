import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';

import {
  DAILY_CARD_SPREAD_MARKER,
  type Spread,
  useSpreadHistory,
} from '@/entities/Spread';
import { useActivity } from '@/entities/Activity';
import TarotCard from '@/entities/TarotCard';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/history';
import TRANSLATIONS_RU from '@/shared/locales/ru/history';
import Button from '@/shared/ui/Button';
import Spinner from '@/shared/ui/Spinner';
import { getTodayString } from '@/shared/utils/getTodayString';
import { isToday } from '@/shared/utils/isToday';

import styles from './HistoryPage.module.css';

type HistoryGroup = 'Today' | 'This week' | 'Earlier';

const getLocalDateKey = (value?: string) => {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const localDate = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (localDate) return `${localDate[3]}-${localDate[2]}-${localDate[1]}`;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getSpreadDateKey = (spread: Spread) =>
  getLocalDateKey(spread.date) || getLocalDateKey(spread.updatedAt);

const formatHistoryDate = (
  dateKey: string,
  today: string,
  locale: string,
  todayLabel: string,
) => {
  if (dateKey === today) return todayLabel;

  const date = new Date(`${dateKey}T12:00:00`);
  if (Number.isNaN(date.getTime())) return dateKey;

  return new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  }).format(date);
};

const getDateValue = (spread: Spread) => {
  const dateKey = getSpreadDateKey(spread);
  const dayTimestamp = new Date(`${dateKey}T00:00:00`).getTime();
  if (Number.isNaN(dayTimestamp)) return 0;

  const updatedAt = spread.updatedAt ? new Date(spread.updatedAt) : null;
  const timeOfDay = updatedAt && !Number.isNaN(updatedAt.getTime())
    ? updatedAt.getHours() * 3_600_000 +
      updatedAt.getMinutes() * 60_000 +
      updatedAt.getSeconds() * 1_000 +
      updatedAt.getMilliseconds()
    : 0;

  return dayTimestamp + timeOfDay;
};

const getHistoryGroup = (spread: Spread, today: string): HistoryGroup => {
  const spreadDateKey = getSpreadDateKey(spread);
  if (spreadDateKey === today) return 'Today';

  const spreadDate = new Date(`${spreadDateKey}T12:00:00`);
  const currentDate = new Date(`${today}T12:00:00`);
  const difference = Math.floor(
    (currentDate.getTime() - spreadDate.getTime()) / 86_400_000,
  );

  return difference >= 0 && difference < 7 ? 'This week' : 'Earlier';
};

export const HistoryPage = () => {
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: areSpreadsLoading,
    spreads,
  } = useSpreadHistory();
  const { activity, isLoading: isActivityLoading } = useActivity();
  const navigate = useNavigate();
  const { i18n, addTranslations, locale } = useLocales();
  const today = getLocalDateKey(getTodayString());
  const hasRevealedDailyCard = activity?.dailyCardLastDate
    ? isToday(activity.dailyCardLastDate)
    : false;

  const groupedSpreads = useMemo(() => {
    const visibleSpreads = (spreads ?? [])
      .filter((spread) => {
        const isCompleted = spread.status === 'completed' || Boolean(spread.interpretation.trim());
        if (!isCompleted || !spread.spreadId) return false;

        if (spread.title !== DAILY_CARD_SPREAD_MARKER) return true;
        return getLocalDateKey(spread.date) !== today || hasRevealedDailyCard;
      })
      .sort((left, right) => getDateValue(right) - getDateValue(left));

    return visibleSpreads.reduce<Record<HistoryGroup, Spread[]>>(
      (groups, spread) => {
        groups[getHistoryGroup(spread, today)].push(spread);
        return groups;
      },
      { Today: [], 'This week': [], Earlier: [] },
    );
  }, [hasRevealedDailyCard, spreads, today]);

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [addTranslations]);

  if (areSpreadsLoading || isActivityLoading) {
    return <Spinner size={'l'} />;
  }

  const hasSpreads = Object.values(groupedSpreads).some((group) => group.length);

  return (
    <div className={styles.container}>
      <button
        className={styles.backButton}
        onClick={() => navigate(-1)}
        type={'button'}
      >
        <span aria-hidden={true}>←</span>
        {i18n('Back')}
      </button>

      <h3 className={styles.title}>{i18n('Spreads history')}</h3>

      {hasSpreads || hasNextPage ? (
        <div className={`${styles.groups} custom-scrollbar`}>
          {(Object.entries(groupedSpreads) as [HistoryGroup, Spread[]][]).map(
            ([groupName, group]) => group.length > 0 && (
              <section className={styles.group} key={groupName}>
                <h4>{i18n(groupName)}</h4>
                <div className={styles.spreads}>
                  {group.map((spread) => {
                    const dateKey = getSpreadDateKey(spread);
                    const visibleCards = spread.cards.slice(0, 4);
                    const hiddenCardsCount = Math.max(0, spread.cards.length - visibleCards.length);
                    const displayTitle = spread.title === DAILY_CARD_SPREAD_MARKER
                      ? i18n(spread.title)
                      : spread.title || spread.question;

                    return (
                      <button
                        className={styles.spread}
                        key={spread.spreadId}
                        onClick={() => navigate(`/history/${spread.spreadId}`, { state: spread })}
                        type={'button'}
                      >
                        <div className={styles.info}>
                          <span className={styles.meta}>
                            {formatHistoryDate(dateKey, today, locale, i18n('Today'))}
                            {spread.title === DAILY_CARD_SPREAD_MARKER && (
                              <span className={styles.dailyLabel}>{i18n('Daily card')}</span>
                            )}
                          </span>
                          <strong>{displayTitle}</strong>
                          {spread.title && spread.title !== DAILY_CARD_SPREAD_MARKER && spread.question && (
                            <span className={styles.question}>{spread.question}</span>
                          )}
                          {(spread.rating ?? 0) > 0 && (
                            <span className={styles.rating} aria-label={`${i18n('Rating')}: ${spread.rating}`}>
                              {'★'.repeat(spread.rating ?? 0)}
                            </span>
                          )}
                        </div>

                        <div className={styles.cardStack} aria-hidden={true}>
                          {visibleCards.map((card, index) => (
                            <TarotCard
                              className={styles.card}
                              hasLoadingState
                              isInverted={card.isInverted}
                              key={`${card.name}-${index}`}
                              localizedName={i18n(card.name)}
                              name={card.name}
                              size={'xs'}
                            />
                          ))}
                          {hiddenCardsCount > 0 && (
                            <span className={styles.moreCards}>+{hiddenCardsCount}</span>
                          )}
                        </div>
                        <span className={styles.chevron} aria-hidden={true}>›</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ),
          )}

          {hasNextPage ? (
            <button
              aria-busy={isFetchingNextPage}
              className={styles.loadMore}
              disabled={isFetchingNextPage}
              onClick={() => {
                fetchNextPage().catch(() => undefined);
              }}
              type={'button'}
            >
              {i18n(
                isFetchingNextPage
                  ? 'Loading more spreads'
                  : 'Show more spreads',
              )}
            </button>
          ) : null}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <span className={styles.emptyStateTitle}>{i18n('No spreads yet')}</span>
          <span className={styles.emptyStateSubtitle}>
            {i18n('Make your first spread to see it here')}
          </span>
          <Button onClick={() => navigate('/reading')}>{i18n('Make spread')}</Button>
        </div>
      )}
    </div>
  );
};
