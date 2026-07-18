import type { PlanetId } from '@/entities/Horoscope/types';
import type {
  PersonalTransit,
  PersonalTransitSummary,
  TransitTargetId,
} from '@/entities/Horoscope/types/transit';
import useLocales from '@/shared/hooks/useLocales';

import styles from './PersonalTransits.module.css';

interface PersonalTransitsProps {
  summary: PersonalTransitSummary | null;
  isLoading?: boolean;
  hasError?: boolean;
  onSelectTransit: (transit: PersonalTransit) => void;
}

const BODY_LABELS: Record<PersonalTransit['transitBody'], string> = {
  sun: 'Sun',
  moon: 'Moon',
  mercury: 'Mercury',
  venus: 'Venus',
  mars: 'Mars',
  jupiter: 'Jupiter',
  saturn: 'Saturn',
  uranus: 'Uranus',
  neptune: 'Neptune',
  pluto: 'Pluto',
  north_node: 'North Node',
  south_node: 'South Node',
  chiron: 'Chiron',
  lilith: 'Lilith',
};

const ANGLE_LABELS: Partial<Record<TransitTargetId, string>> = {
  asc: 'ASC',
  mc: 'MC',
  ic: 'IC',
  dc: 'DSC',
};

const TARGET_FOCUS_KEYS: Record<TransitTargetId, string> = {
  sun: 'Transit focus: Sun',
  moon: 'Transit focus: Moon',
  mercury: 'Transit focus: Mercury',
  venus: 'Transit focus: Venus',
  mars: 'Transit focus: Mars',
  jupiter: 'Transit focus: Jupiter',
  saturn: 'Transit focus: Saturn',
  uranus: 'Transit focus: Uranus',
  neptune: 'Transit focus: Neptune',
  pluto: 'Transit focus: Pluto',
  north_node: 'Transit focus: North Node',
  chiron: 'Transit focus: Chiron',
  lilith: 'Transit focus: Lilith',
  asc: 'Transit focus: ASC',
  mc: 'Transit focus: MC',
  ic: 'Transit focus: IC',
  dc: 'Transit focus: DSC',
};

const ASPECT_MEANING_KEYS: Record<PersonalTransit['aspect'], string> = {
  conjunction: 'Transit meaning: conjunction',
  opposition: 'Transit meaning: opposition',
  square: 'Transit meaning: square',
  trine: 'Transit meaning: trine',
  sextile: 'Transit meaning: sextile',
  quincunx: 'Transit meaning: quincunx',
  semisextile: 'Transit meaning: semisextile',
};

const getTargetLabel = (
  transit: PersonalTransit,
  i18n: (key: string) => string,
) => ANGLE_LABELS[transit.natalTarget] ??
  i18n(BODY_LABELS[transit.natalTarget as PlanetId]);

export const PersonalTransits = ({
  summary,
  isLoading = false,
  hasError = false,
  onSelectTransit,
}: PersonalTransitsProps) => {
  const { i18n, locale } = useLocales();
  const date = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
  }).format(summary ? new Date(summary.timestamp) : new Date());

  const status = hasError
    ? i18n('Personal transits are temporarily unavailable')
    : isLoading
      ? i18n('Calculating personal transits')
      : i18n('No significant exact transits for this date');

  return (
    <section className={styles.section} aria-labelledby={'personal-transits-title'}>
      <div className={styles.heading}>
        <div>
          <span className={styles.eyebrow}>{date}</span>
          <h4 id={'personal-transits-title'}>{i18n('Your transits today')}</h4>
        </div>
        <p>{i18n('Current sky positions compared with your natal chart')}</p>
      </div>

      {summary?.highlights.length ? (
        <div className={styles.grid}>
          {summary.highlights.map((transit, index) => {
            const isPlanetTarget = transit.targetType === 'planet';
            const content = (
              <>
                <span className={styles.rank}>{String(index + 1).padStart(2, '0')}</span>
                <strong>
                  {i18n(BODY_LABELS[transit.transitBody])}{' '}
                  {i18n(transit.aspect)}{' '}
                  {getTargetLabel(transit, i18n)}
                </strong>
                <span className={styles.meta}>
                  {i18n(
                    transit.phase === 'applying'
                      ? 'Applying aspect'
                      : transit.phase === 'separating'
                        ? 'Separating aspect'
                        : 'Stationary influence',
                  )}
                  {' · '}{i18n('Orb')} {transit.orb.toFixed(1)}°
                </span>
                <p className={styles.meaning}>{i18n(ASPECT_MEANING_KEYS[transit.aspect])}</p>
                <span className={styles.focus}>{i18n(TARGET_FOCUS_KEYS[transit.natalTarget])}</span>
                {transit.natalHouse && (
                  <span className={styles.house}>
                    {i18n('Transit through natal house')} {transit.natalHouse}
                  </span>
                )}
                {isPlanetTarget && <span className={styles.action}>{i18n('Show in chart')} →</span>}
              </>
            );

            return isPlanetTarget ? (
              <button
                type={'button'}
                key={transit.id}
                className={`${styles.card} ${index === 0 ? styles.primaryCard : ''}`}
                onClick={() => onSelectTransit(transit)}
              >
                {content}
              </button>
            ) : (
              <article
                key={transit.id}
                className={`${styles.card} ${index === 0 ? styles.primaryCard : ''}`}
              >
                {content}
              </article>
            );
          })}
        </div>
      ) : (
        <div className={`${styles.status} ${isLoading ? styles.loading : ''}`}>
          <span aria-hidden={'true'} />
          {status}
        </div>
      )}

      {summary?.highlights.length ? (
        <small className={styles.note}>
          {i18n('Highlights are selected by aspect precision and chart significance')}
        </small>
      ) : null}
    </section>
  );
};

export default PersonalTransits;
