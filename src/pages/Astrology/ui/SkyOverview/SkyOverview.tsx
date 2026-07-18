import { useMemo, type ReactNode } from 'react';

import { useDailyEphemeris } from '@/entities/Horoscope';
import useLocales from '@/shared/hooks/useLocales';
import Spinner from '@/shared/ui/Spinner';
import Zodiac from '@/shared/ui/Zodiac';
import type { Sign } from '@/shared/ui/Zodiac';

import styles from './SkyOverview.module.css';

interface SkyOverviewProps {
  sign?: Sign;
  actions?: ReactNode;
}

const NORMALIZED_SIGNS: Partial<Record<Sign, Sign>> = {
  Овен: 'Aries',
  Телец: 'Taurus',
  Близнецы: 'Gemini',
  Рак: 'Cancer',
  Лев: 'Leo',
  Дева: 'Virgo',
  Весы: 'Libra',
  Скорпион: 'Scorpio',
  Стрелец: 'Sagittarius',
  Козерог: 'Capricorn',
  Водолей: 'Aquarius',
  Рыбы: 'Pisces',
};

const SIGNALS = [
  { body: 'Mercury', id: 'mercury', label: 'Thinking and communication' },
  { body: 'Venus', id: 'venus', label: 'Relationships and values' },
  { body: 'Mars', id: 'mars', label: 'Action and initiative' },
] as const;

const BODY_DOMAINS: Record<string, string> = {
  Sun: 'attention and self-expression',
  Mercury: 'communication and decisions',
  Venus: 'relationships and values',
  Mars: 'actions and conflicts',
  Jupiter: 'growth and long-term plans',
  Saturn: 'commitments and limitations',
  Uranus: 'change and independence',
  Neptune: 'ideals and boundaries',
  Pluto: 'power and deep changes',
};

export const SkyOverview = ({ actions, sign }: SkyOverviewProps) => {
  const { astrology, bodies, error, isLoading, timestamp } =
    useDailyEphemeris();
  const { i18n, locale } = useLocales();
  const normalizedSign = sign ? (NORMALIZED_SIGNS[sign] ?? sign) : undefined;

  const mainEvent = useMemo(() => {
    const station = astrology?.stations.find(({ body }) => body !== 'Moon');
    const ingress = astrology?.ingresses.find(({ body }) => body !== 'Moon');
    const sun = bodies.Sun;

    if (station) {
      return {
        title: i18n('{body} changes direction', {
          body: i18n(station.body),
        }),
        description: i18n('A turning point in the current planetary rhythm'),
        body: station.body,
        kind: 'station' as const,
      };
    }

    if (ingress) {
      return {
        title: i18n('{body} enters {sign}', {
          body: i18n(ingress.body),
          sign: i18n(ingress.sign),
        }),
        description: i18n('The focus of this planet is shifting'),
        body: ingress.body,
        kind: 'ingress' as const,
      };
    }

    return {
      title: sun
        ? i18n('Sun in {sign}', { sign: i18n(sun.sign) })
        : i18n('The sky right now'),
      description: i18n('The central context of the current period'),
      body: 'Sun' as const,
      kind: 'position' as const,
    };
  }, [astrology, bodies.Sun, i18n]);

  const practicalFocus = useMemo(() => {
    const domain = i18n(BODY_DOMAINS[mainEvent.body] ?? 'current priorities');

    if (mainEvent.kind === 'station') {
      return i18n(
        "Avoid rushing decisions around {domain}: the planet's rhythm is changing.",
        { domain },
      );
    }

    if (mainEvent.kind === 'ingress') {
      return i18n(
        'Notice shifting priorities around {domain}: the planet is entering a new sign.',
        { domain },
      );
    }

    return i18n(
      'There are no abrupt planetary changes today; use the positions below as context',
    );
  }, [i18n, mainEvent]);

  const focusBody = bodies[mainEvent.body];

  const ephemerisTime = timestamp
    ? new Date(timestamp).toLocaleString(locale, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
    : null;

  const todayLabel = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  const formatPosition = (body: { degreeInSign: number; sign: Sign }) =>
    `${body.degreeInSign.toLocaleString(locale, {
      maximumFractionDigits: 1,
    })}° ${i18n(body.sign)}`;

  if (isLoading) {
    return (
      <div className={styles.status} role={'status'}>
        <Spinner size={'l'} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.status} role={'alert'}>
        {i18n('Unable to load astrology data')}
      </div>
    );
  }

  return (
    <section className={styles.overview} aria-labelledby={'sky-overview-title'}>
      <header className={styles.header}>
        <div className={styles.headerMeta}>
          <span className={styles.eyebrow}>{i18n('Sky now')}</span>
          <time dateTime={new Date().toISOString().slice(0, 10)}>
            {todayLabel}
          </time>
        </div>
        <h1 className={styles.title} id={'sky-overview-title'}>
          {mainEvent.title}
        </h1>
        <p className={styles.description}>{mainEvent.description}</p>
      </header>

      {actions}

      <div className={styles.profile}>
        {normalizedSign ? (
          <span className={styles.profileSign} aria-hidden={'true'}>
            <Zodiac sign={normalizedSign} type={'small'} />
          </span>
        ) : null}
        <span>
          {normalizedSign
            ? `${i18n('Your solar sign')}: ${i18n(normalizedSign)}. ${i18n('This is a general sky overview')}`
            : i18n('This is a general sky overview')}
        </span>
      </div>

      <div className={styles.focus}>
        <span>{i18n('Practical focus')}</span>
        <strong>{practicalFocus}</strong>
        {focusBody ? (
          <small>
            {`${i18n('Based on')}: ${i18n(mainEvent.body)} — ${formatPosition(focusBody)}, ${i18n(focusBody.motionState)}`}
          </small>
        ) : null}
      </div>

      <div className={styles.signals}>
        {SIGNALS.map(({ body, id, label }) => {
          const item = bodies[body];

          return (
            <article className={styles.signal} key={body}>
              {item ? (
                <span
                  className={styles.signalSign}
                  title={i18n(item.sign)}
                  aria-label={i18n(item.sign)}
                >
                  <Zodiac
                    sign={NORMALIZED_SIGNS[item.sign] ?? item.sign}
                    type={'small'}
                  />
                </span>
              ) : null}
              <img
                className={styles.planet}
                src={`/assets/images/horoscope/${id}.png`}
                alt={''}
              />
              <span className={styles.signalLabel}>{i18n(label)}</span>
              <strong>{i18n(body)}</strong>
              <span className={styles.position}>
                {item
                  ? `${formatPosition(item)} · ${i18n(item.motionState)}`
                  : i18n('No data')}
              </span>
            </article>
          );
        })}
      </div>

      <p className={styles.source}>
        {`${i18n('Source')}: ${i18n('calculated ephemeris')}${ephemerisTime ? ` · ${ephemerisTime}` : ''}. ${i18n('Interpretation uses current planetary positions')}`}
      </p>
    </section>
  );
};
