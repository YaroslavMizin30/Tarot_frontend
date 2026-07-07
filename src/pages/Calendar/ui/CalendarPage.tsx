import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import useLocales from '@/shared/hooks/useLocales';
import ArrowButton from '@/shared/ui/ArrowButton';
import TRANSLATIONS_EN from '@/shared/locales/en/calendar';
import TRANSLATIONS_RU from '@/shared/locales/ru/calendar';

import StarsComposition from '@/pages/ui/StarsComposition';

import { useCalendar, useDailyEphemeris } from '@/entities/Horoscope';

import Moon from './Moon/Moon';

import styles from './CalendarPage.module.css';

export const CalendarPage = () => {
  const { i18n, addTranslations, locale } = useLocales();

  const navigate = useNavigate();

  const { moonPhases, getMoonDescription, phaseName, zodiac } = useCalendar();

  const { bodies, isMoonVoidOfCourse } = useDailyEphemeris();

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  return (
    <div className={styles.container}>
      <StarsComposition />

      <div className={styles.calendar}>
        {phaseName ? (
          <Moon
            phase={phaseName?.toLowerCase().replace(/\s/g, '')}
            size={'l'}
            style={{ position: 'absolute', right: 0 }}
          />
        ) : null}

        <h4 className={styles.title}>{`${i18n('Moon')}`}</h4>

        <div className={styles.current}>
          {phaseName ? <span>{`${i18n(phaseName)}`}</span> : null}&nbsp;
          {zodiac ? (
            <span>{`${i18n('is in sign')} ${i18n(bodies?.Moon?.sign ?? '')}.`}</span>
          ) : null}{' '}
          <span className={styles.conclusion}>
            {getMoonDescription(isMoonVoidOfCourse)}
          </span>
        </div>

        {moonPhases ? `${i18n('Next phases')}:` : null}

        {moonPhases ? (
          <div className={styles.nextPhases}>
            {moonPhases.map(({ name, date }) => {
              return (
                <div className={styles.phase} key={date}>
                  <span style={{ zIndex: 1 }}>
                    {new Date(date).toLocaleDateString()}
                  </span>

                  <Moon phase={name?.toLowerCase()} size={'s'} />

                  <span>{i18n(name)}</span>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className={styles.bottom}>
        <ArrowButton
          onClick={() => navigate('/astrology')}
          style={{ zIndex: 1 }}
        />
      </div>
    </div>
  );
};
