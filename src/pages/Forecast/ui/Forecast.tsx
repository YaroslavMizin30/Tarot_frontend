import { useNavigate } from 'react-router';

import useLocales from '@/shared/hooks/useLocales';
import ArrowButton from '@/shared/ui/ArrowButton';
import Spinner from '@/shared/ui/Spinner';

import {
  useEphemeris,
  useCalendar,
  type MoonPhaseName,
} from '@/entities/Horoscope';

import Circle from '@/features/Circle';

import StarsComposition from '@/pages/ui/StarsComposition';

import Moon from './Moon/Moon';

import styles from './Forecast.module.css';

export const Forecast = () => {
  const { calendar, moonPhases } = useCalendar();
  const {
    bodies,
    isLoading,
    retrogradeBodies,
    stations,
    dateTime,
    isMoonVoidOfCourse,
  } = useEphemeris();

  const { i18n } = useLocales();
  const navigate = useNavigate();

  const { phase, zodiac, nextPhases } = calendar ?? {};
  const { name } = phase ?? {};
  const { sign } = zodiac ?? {};

  const getMoonDescription = (phaseName: MoonPhaseName) => {
    if (isMoonVoidOfCourse) {
      return i18n(
        'The moon is void of course. Time for rest, routine activities or wrapping old matters.',
      );
    }

    switch (phaseName) {
      case 'New Moon':
        return i18n(
          'A time for new beginnings and planting seeds of intention.',
        );
      case 'First Quarter':
        return i18n('A moment to exercise willpower and overcome doubts');
      case 'Last Quarter':
        return i18n('Let go of what no longer serves.');
      case 'Full Moon':
        return i18n(
          'A powerful moment for release and celebrating achievements',
        );
      case 'Waning Crescent':
        return i18n(
          'A time for solitude, meditation, and preparing for new beginnings',
        );
      case 'Waning Gibbous':
        return i18n(
          "Energy begins to wane. Share experiences, express appreciation for what you've received",
        );
      case 'Waxing Crescent':
        return i18n('A time to act, overcoming early obstacles');
      case 'Waxing Gibbous':
        return i18n('A time for patience, analysis, and faith in your path');
    }
  };

  if (isLoading) {
    return <Spinner size={'l'} />;
  }

  return (
    <div className={styles.container}>
      <StarsComposition />

      <h4 className={styles.title}>{dateTime}</h4>

      <div className={styles.positions}>
        <h4 className={styles.title}>{`${i18n('Planets')}`}</h4>

        <Circle
          className={styles.circle}
          positions={{
            moon: bodies?.Moon?.signId,
            mars: bodies?.Mars?.signId,
            venus: bodies?.Venus?.signId,
            sun: bodies?.Sun?.signId,
            mercury: bodies?.Mercury?.signId,
            jupiter: bodies?.Jupiter?.signId,
            uranus: bodies?.Uranus?.signId,
            neptune: bodies?.Uranus?.signId,
            saturn: bodies?.Saturn?.signId,
            pluto: bodies?.Pluto?.signId,
          }}
        />

        <div className={styles.data}>
          {retrogradeBodies?.length ? (
            <span>
              {i18n('Retrograde bodies:')} {retrogradeBodies}
            </span>
          ) : null}

          {stations?.length ? (
            <span>
              {i18n('Station bodies:')} {stations}
            </span>
          ) : null}
        </div>
      </div>

      <div className={styles.calendar}>
        {name ? (
          <Moon
            phase={name?.toLowerCase().replace(/\s/g, '')}
            size={'l'}
            style={{ position: 'absolute', right: 0 }}
          />
        ) : null}

        <h4 className={styles.title}>{`${i18n('Moon')}`}</h4>

        <div className={styles.current}>
          {name ? <span>{`${i18n(name)}`}</span> : null}&nbsp;
          {sign ? (
            <span>{`${i18n('is in sign')} ${i18n(bodies?.Moon?.sign ?? '')}.`}</span>
          ) : null}{' '}
          <span className={styles.conclusion}>{getMoonDescription(name!)}</span>
        </div>

        {nextPhases ? `${i18n('Next phases')}:` : null}

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
