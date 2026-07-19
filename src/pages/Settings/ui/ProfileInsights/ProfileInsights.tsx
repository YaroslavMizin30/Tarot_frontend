import { useMemo } from 'react';

import type { Spread } from '@/entities/Spread';
import { getCardInfoI18n } from '@/entities/TarotCard';
import useLocales from '@/shared/hooks/useLocales';

import { getProfileInsights, type TarotSuit } from '../../lib/profileInsights';

import styles from './ProfileInsights.module.css';

interface ProfileInsightsProps {
  spreads: Spread[];
}

const SUIT_LABELS: Record<TarotSuit, string> = {
  wands: 'Wands',
  cups: 'Cups',
  swords: 'Swords',
  coins: 'Pentacles',
};

const SuitIcon = ({ suit }: { suit: TarotSuit }) => {
  const commonProps = {
    'aria-hidden': true,
    className: styles.suitIcon,
    viewBox: '0 0 24 24',
  };

  switch (suit) {
    case 'wands':
      return (
        <svg {...commonProps}>
          <path d={'M6.5 20 17.4 3.8'} />
          <path d={'m12.4 11.3 4-.8M10.3 14.5l-3.4-.2M15 7.4l-2.5-.8'} />
        </svg>
      );
    case 'cups':
      return (
        <svg {...commonProps}>
          <path d={'M7 4h10v3.2c0 3.8-2 6-5 6s-5-2.2-5-6V4Z'} />
          <path d={'M12 13.2V19M8.5 20h7'} />
        </svg>
      );
    case 'swords':
      return (
        <svg {...commonProps}>
          <path d={'m12 2.5 2.2 12.3H9.8L12 2.5Z'} />
          <path d={'M7.8 15h8.4M12 15v6M9.8 21h4.4'} />
        </svg>
      );
    case 'coins':
      return (
        <svg {...commonProps}>
          <circle cx={'12'} cy={'12'} r={'9'} />
          <path d={'m12 5 1.6 4.3 4.6.2-3.6 2.8 1.2 4.4-3.8-2.5-3.8 2.5 1.2-4.4-3.6-2.8 4.6-.2L12 5Z'} />
        </svg>
      );
  }
};

export const ProfileInsights = ({ spreads }: ProfileInsightsProps) => {
  const { i18n } = useLocales();
  const insights = useMemo(() => getProfileInsights(spreads), [spreads]);
  const repeatedCardName = insights.repeatedCard
    ? getCardInfoI18n(insights.repeatedCard, i18n)?.name
    : undefined;

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h2>{i18n('Your observations')}</h2>
        <span>{i18n('Last 30 days')}</span>
      </header>

      <div className={styles.metrics}>
        <div className={`${styles.metric} ${styles.primary}`}>
          <strong>{insights.completedSpreads}</strong>
          <span>{i18n('Completed spreads')}</span>
        </div>

        <div className={styles.metric}>
          <span>{i18n('Repeating card')}</span>
          <div className={styles.value}>
            <strong title={repeatedCardName}>
              {repeatedCardName ?? i18n('No repetition yet')}
            </strong>
            {insights.repeatedCardCount > 0 && (
              <small>×{insights.repeatedCardCount}</small>
            )}
          </div>
        </div>

        <div className={styles.metric}>
          <span>{i18n('Dominant suit')}</span>
          <div className={styles.value}>
            {insights.dominantSuit && (
              <SuitIcon suit={insights.dominantSuit} />
            )}
            <strong>
              {insights.dominantSuit
                ? i18n(SUIT_LABELS[insights.dominantSuit])
                : i18n('More data needed')}
            </strong>
            {insights.dominantSuitPercent !== undefined && (
              <small>{insights.dominantSuitPercent}%</small>
            )}
          </div>
        </div>

        <div className={styles.metric}>
          <span>{i18n('Major arcana')}</span>
          <strong>
            {insights.totalCards > 0
              ? `${insights.majorArcanaCount}/${insights.totalCards}`
              : '—'}
          </strong>
        </div>
      </div>

      <p className={styles.note}>
        {insights.totalCards > 0
          ? `${i18n('Cards analyzed')}: ${insights.totalCards}`
          : i18n('Complete a few readings to reveal your patterns')}
      </p>
    </section>
  );
};

export default ProfileInsights;
