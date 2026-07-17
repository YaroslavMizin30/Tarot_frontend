import { useEffect } from 'react';

import { useDailyEphemeris } from '@/entities/Horoscope';
import Circle, { useHighlights } from '@/features/Circle';
import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/forecast';
import TRANSLATIONS_RU from '@/shared/locales/ru/forecast';
import Spinner from '@/shared/ui/Spinner';
import Zodiac from '@/shared/ui/Zodiac';

import styles from './DailyForecast.module.css';

const PLANETS = [
  { name: 'Sun', id: 'sun', imageWidth: 20 },
  { name: 'Mars', id: 'mars', imageWidth: 20 },
  { name: 'Mercury', id: 'mercury', imageWidth: 20 },
  { name: 'Venus', id: 'venus', imageWidth: 20 },
  { name: 'Moon', id: 'moon', imageWidth: 20 },
  { name: 'Neptune', id: 'neptune', imageWidth: 20 },
  { name: 'Uranus', id: 'uranus', imageWidth: 35 },
  { name: 'Saturn', id: 'saturn', imageWidth: 40 },
  { name: 'Jupiter', id: 'jupiter', imageWidth: 20 },
  { name: 'Pluto', id: 'pluto', imageWidth: 20 },
] as const;

export const DailyForecast = () => {
  const { bodies, isLoading, dateTime } = useDailyEphemeris();
  const { i18n, locale, addTranslations } = useLocales();

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [addTranslations, locale]);

  const { highlightedBodies, rootRef, addElement } = useHighlights({
    deps: [isLoading],
  });

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spinner size={'l'} />
      </div>
    );
  }

  return (
    <section className={styles.forecast}>
      <h4 className={styles.title}>{dateTime}</h4>

      <Circle
        className={styles.circle}
        bodies={bodies}
        highlightedBodies={highlightedBodies}
      />

      <div className={`${styles.planets} custom-scrollbar`} ref={rootRef}>
        {PLANETS.map(({ name, id, imageWidth }) => {
          const body = bodies[name];

          return (
            <div className={styles.planetItem} key={id}>
              <div className={`${styles.planetHeading} ${styles[id]}`}>
                <img
                  width={imageWidth}
                  height={20}
                  src={`/assets/images/horoscope/${id}.png`}
                  className={styles.planetIcon}
                  ref={addElement}
                  data-planet={id}
                  alt={''}
                />
                {i18n(name)}
                <Zodiac
                  className={styles.sign}
                  type={'small'}
                  sign={body?.sign}
                />
              </div>

              <div className={styles.description}>
                <span>{`${i18n('Absolute position')}: ${body?.absPos}°`}</span>
                <span>{`${i18n('Sign')}: ${body?.degreeInSign}° ${i18n('in')} ${i18n(body?.signId ?? '')}`}</span>
                <span>{`${i18n('Motion state')}: ${i18n(body?.motionState ?? '')}`}</span>
                <span>{`${i18n('Speed')}: ${body?.speed}° ${i18n('a day')}`}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
