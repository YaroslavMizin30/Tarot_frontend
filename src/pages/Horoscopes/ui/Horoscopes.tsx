import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import {
  useGeneralHoroscopes,
  type GeneralHoroscopeFacts,
  type GeneralHoroscopePeriod,
} from '@/entities/Horoscope';
import { useUser } from '@/entities/User';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/horoscopes';
import TRANSLATIONS_RU from '@/shared/locales/ru/horoscopes';
import ArrowButton from '@/shared/ui/ArrowButton';
import Zodiac from '@/shared/ui/Zodiac';

import styles from './Horoscopes.module.css';

const TYPES: { name: string; value: GeneralHoroscopePeriod }[] = [
  { name: 'Daily', value: 'daily' },
  { name: 'Weekly', value: 'weekly' },
  { name: 'Monthly', value: 'monthly' },
];

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const sanitizeForecastText = (value: string) =>
  value
    .replace(/\s*[([]\s*id\s*:\s*[\w.-]+\s*[)\]]/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

const formatPeriodRange = (
  startDate: string,
  endDate: string,
  locale: string,
  compact = false,
) => {
  const formatter = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: compact ? 'short' : 'long',
  });
  const start = formatter.format(new Date(`${startDate}T12:00:00Z`));
  if (startDate === endDate) return start;
  const end = formatter.format(new Date(`${endDate}T12:00:00Z`));
  return `${start} — ${end}`;
};

export const Horoscopes = () => {
  const [selectedType, setSelectedType] =
    useState<GeneralHoroscopePeriod>('daily');
  const [showBasis, setShowBasis] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser() ?? {};
  const { i18n, addTranslations, locale } = useLocales();
  const forecastLocale = locale === 'ru' ? 'ru' : 'en';
  const { forecasts, isLoading, isError } = useGeneralHoroscopes(
    user?.sign,
    forecastLocale,
  );

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [addTranslations, locale]);

  const selected = forecasts[selectedType];
  const forecast = selected?.forecast;

  const periodLabel = useMemo(() => {
    if (!forecast) return '';
    return formatPeriodRange(
      forecast.period_start,
      forecast.period_end,
      locale,
    );
  }, [forecast, locale]);

  const basisFacts = useMemo(() => {
    if (!forecast) return [];
    const facts = forecast.facts as GeneralHoroscopeFacts;
    const allFacts = [
      ...(facts.significant_aspects ?? []),
      ...(facts.stations ?? []),
      ...(facts.ingresses ?? []),
      ...(facts.moon_phases ?? []),
    ];
    const ids = new Set([
      ...forecast.content.supportive_factor.basis,
      ...forecast.content.tension.basis,
    ]);
    return allFacts.filter(({ id }) => ids.has(id));
  }, [forecast]);

  const formatFact = (fact: (typeof basisFacts)[number]) => {
    if (fact.planets?.length === 2 && fact.type) {
      const planets = fact.planets
        .map((planet) => i18n(capitalize(planet)))
        .join(' — ');
      const orb = typeof fact.orb === 'number'
        ? ` · ${i18n('Orb')} ${fact.orb.toFixed(2)}°`
        : '';
      const phase = fact.phase ? ` · ${i18n(capitalize(fact.phase))}` : '';
      return `${planets}: ${i18n(capitalize(fact.type))}${orb}${phase}`;
    }
    if (fact.body && fact.sign) {
      return `${i18n(capitalize(fact.body))} — ${i18n(capitalize(fact.sign))}`;
    }
    if (fact.name) return i18n(fact.name);
    return fact.date ?? fact.id;
  };

  return (
    <div className={styles.container}>
      <button
        type={'button'}
        className={styles.topBack}
        aria-label={i18n('Back')}
        onClick={() => navigate('/astrology')}
      >
        <span aria-hidden={'true'}>←</span>
        {i18n('Back')}
      </button>

      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>{i18n('General forecast')}</span>
          <h1>{user?.sign ? i18n(user.sign) : i18n('Horoscope')}</h1>
          <p>{i18n('Based on current planetary positions')}</p>
        </div>
        {user?.sign && (
          <div className={styles.zodiacMark} aria-hidden={'true'}>
            <Zodiac
              sign={user.sign}
              type={'big'}
              className={styles.zodiacArtwork}
            />
          </div>
        )}
      </header>

      <nav className={styles.tabs} aria-label={i18n('Forecast period')}>
        {TYPES.map((type) => {
          const periodForecast = forecasts[type.value]?.forecast;

          return (
            <button
              type={'button'}
              key={type.value}
              className={type.value === selectedType ? styles.activeTab : ''}
              onClick={() => {
                setSelectedType(type.value);
                setShowBasis(false);
              }}
            >
              <span>{i18n(type.name)}</span>
              {periodForecast && (
                <small>
                  {formatPeriodRange(
                    periodForecast.period_start,
                    periodForecast.period_end,
                    locale,
                    true,
                  )}
                </small>
              )}
            </button>
          );
        })}
      </nav>

      <main className={styles.forecast}>
        {isLoading ? (
          <div className={styles.state}>
            <span className={styles.loader} />
            <p>{i18n('Loading forecast...')}</p>
          </div>
        ) : isError ? (
          <div className={styles.state}>
            <h2>{i18n('Unable to load forecast')}</h2>
            <p>{i18n('Try opening this page a little later')}</p>
          </div>
        ) : !forecast ? (
          <div className={styles.state}>
            <h2>{i18n('Forecast is being prepared')}</h2>
            <p>{i18n('It will appear here as soon as it is ready')}</p>
          </div>
        ) : (
          <article>
            <div className={styles.forecastMeta}>
              <span>{periodLabel}</span>
              <span className={styles.freeBadge}>{i18n('Available to everyone')}</span>
            </div>

            {selected.isFallback && (
              <div className={styles.fallbackNotice}>
                {i18n('A new forecast is being prepared. Showing the previous one for now.')}
              </div>
            )}

            <h2>{sanitizeForecastText(forecast.content.title)}</h2>
            <p className={styles.summary}>
              {sanitizeForecastText(forecast.content.summary)}
            </p>

            <section className={styles.focus}>
              <span>{i18n('Main focus')}</span>
              <p>{sanitizeForecastText(forecast.content.focus)}</p>
            </section>

            <div className={styles.factors}>
              <section className={styles.supportive}>
                <span>{i18n('What supports you')}</span>
                <p>
                  {sanitizeForecastText(
                    forecast.content.supportive_factor.text,
                  )}
                </p>
              </section>
              <section className={styles.tension}>
                <span>{i18n('What needs attention')}</span>
                <p>{sanitizeForecastText(forecast.content.tension.text)}</p>
              </section>
            </div>

            <section className={styles.action}>
              <span>{i18n('Practical step')}</span>
              <p>
                {sanitizeForecastText(forecast.content.practical_step)}
              </p>
            </section>

            {basisFacts.length > 0 && (
              <div className={styles.basis}>
                <button
                  type={'button'}
                  onClick={() => setShowBasis((value) => !value)}
                >
                  {i18n(showBasis ? 'Hide forecast basis' : 'What is this forecast based on?')}
                  <span aria-hidden={'true'}>{showBasis ? '−' : '+'}</span>
                </button>
                {showBasis && (
                  <ul>
                    {basisFacts.map((fact) => (
                      <li key={fact.id}>{formatFact(fact)}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </article>
        )}
      </main>

      <div className={styles.bottom}>
        <ArrowButton onClick={() => navigate('/astrology')} />
      </div>
    </div>
  );
};
