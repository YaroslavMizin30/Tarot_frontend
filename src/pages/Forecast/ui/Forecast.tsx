import { useEffect } from 'react';

import { useNavigate } from 'react-router';

import useLocales from '@/shared/hooks/useLocales';
import ArrowButton from '@/shared/ui/ArrowButton';
import Spinner from '@/shared/ui/Spinner';
import TRANSLATIONS_RU from '@/shared/locales/ru/forecast';
import TRANSLATIONS_EN from '@/shared/locales/en/forecast';

import { useDailyEphemeris } from '@/entities/Horoscope';

import Circle, { useHighlights } from '@/features/Circle';

import StarsComposition from '@/pages/ui/StarsComposition';

import styles from './Forecast.module.css';
import Zodiac from '@/shared/ui/Zodiac';

export const Forecast = () => {
  const { bodies, isLoading, dateTime } = useDailyEphemeris();

  const { i18n, locale, addTranslations } = useLocales();
  const navigate = useNavigate();

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  const { highlightedBodies, rootRef, addElement } = useHighlights({
    deps: [isLoading],
  });

  if (isLoading) {
    return <Spinner size={'l'} />;
  }

  return (
    <div className={styles.container}>
      <StarsComposition />

      <h4 className={styles.title}>{dateTime}</h4>

      <div className={styles.positions}>
        <Circle
          className={styles.circle}
          bodies={bodies}
          highlightedBodies={highlightedBodies}
        />

        <div className={`${styles.accordion} custom-scrollbar`} ref={rootRef}>
          <div className={styles.item}>
            <div className={`${styles.button} ${styles.sun}`}>
              <img
                width={20}
                height={20}
                src={'/assets/images/horoscope/sun.png'}
                className={styles.planet}
                ref={addElement}
                data-planet={'sun'}
              />
              {i18n('Sun')}
              <Zodiac
                className={styles.sign}
                type={'small'}
                sign={bodies.Sun?.sign}
              />
            </div>

            <div className={styles.description}>
              <span>
                {`${i18n('Absolute position')}: ${bodies.Sun?.absPos}°`}
              </span>

              <span>
                {`${i18n('Sign')}: ${bodies.Sun?.degreeInSign}° ${i18n('in')} ${i18n(bodies?.Sun?.signId ?? '')}`}
              </span>

              <span>
                {`${i18n('Motion state')}: ${i18n(bodies.Sun?.motionState ?? '')}`}
              </span>

              <span>
                {`${i18n('Speed')}: ${bodies.Sun?.speed}° ${i18n('a day')}`}
              </span>
            </div>
          </div>

          <div className={styles.item}>
            <div className={`${styles.button} ${styles.mars}`}>
              <img
                width={20}
                height={20}
                src={'/assets/images/horoscope/mars.png'}
                className={styles.planet}
                ref={addElement}
                data-planet={'mars'}
              />
              {i18n('Mars')}
              <Zodiac
                className={styles.sign}
                type={'small'}
                sign={bodies.Mars?.sign}
              />
            </div>

            <div className={styles.description}>
              <span>
                {`${i18n('Absolute position')}: ${bodies.Mars?.absPos}°`}
              </span>

              <span>
                {`${i18n('Sign')}: ${bodies.Mars?.degreeInSign}° ${i18n('in')} ${i18n(bodies?.Mars?.signId ?? '')}`}
              </span>

              <span>
                {`${i18n('Motion state')}: ${i18n(bodies.Mars?.motionState ?? '')}`}
              </span>

              <span>
                {`${i18n('Speed')}: ${bodies.Mars?.speed}° ${i18n('a day')}`}
              </span>
            </div>
          </div>

          <div className={styles.item}>
            <div className={`${styles.button} ${styles.mercury}`}>
              <img
                width={20}
                height={20}
                src={'/assets/images/horoscope/mercury.png'}
                className={styles.planet}
                ref={addElement}
                data-planet={'mercury'}
              />
              {i18n('Mercury')}
              <Zodiac
                className={styles.sign}
                type={'small'}
                sign={bodies.Mercury?.sign}
              />
            </div>

            <div className={styles.description}>
              <span>
                {`${i18n('Absolute position')}: ${bodies.Mercury?.absPos}°`}
              </span>

              <span>
                {`${i18n('Sign')}: ${bodies.Mercury?.degreeInSign}° ${i18n('in')} ${i18n(bodies?.Mercury?.signId ?? '')}`}
              </span>

              <span>
                {`${i18n('Motion state')}: ${i18n(bodies.Mercury?.motionState ?? '')}`}
              </span>

              <span>
                {`${i18n('Speed')}: ${bodies.Mercury?.speed}° ${i18n('a day')}`}
              </span>
            </div>
          </div>

          <div className={styles.item}>
            <div className={`${styles.button} ${styles.venus}`}>
              <img
                width={20}
                height={20}
                src={'/assets/images/horoscope/venus.png'}
                className={styles.planet}
                ref={addElement}
                data-planet={'venus'}
              />
              {i18n('Venus')}
              <Zodiac
                className={styles.sign}
                type={'small'}
                sign={bodies.Venus?.sign}
              />
            </div>

            <div className={styles.description}>
              <span>
                {`${i18n('Absolute position')}: ${bodies.Venus?.absPos}°`}
              </span>

              <span>
                {`${i18n('Sign')}: ${bodies.Venus?.degreeInSign}° ${i18n('in')} ${i18n(bodies?.Venus?.signId ?? '')}`}
              </span>

              <span>
                {`${i18n('Motion state')}: ${i18n(bodies.Venus?.motionState ?? '')}`}
              </span>

              <span>
                {`${i18n('Speed')}: ${bodies.Venus?.speed}° ${i18n('a day')}`}
              </span>
            </div>
          </div>

          <div className={styles.item}>
            <div className={`${styles.button} ${styles.moon}`}>
              <img
                width={20}
                height={20}
                src={'/assets/images/horoscope/moon.png'}
                className={styles.planet}
                ref={addElement}
                data-planet={'moon'}
              />
              {i18n('Moon')}
              <Zodiac
                className={styles.sign}
                type={'small'}
                sign={bodies.Moon?.sign}
              />
            </div>

            <div className={styles.description}>
              <span>
                {`${i18n('Absolute position')}: ${bodies.Moon?.absPos}°`}
              </span>

              <span>
                {`${i18n('Sign')}: ${bodies.Moon?.degreeInSign}° ${i18n('in')} ${i18n(bodies?.Moon?.signId ?? '')}`}
              </span>

              <span>
                {`${i18n('Motion state')}: ${i18n(bodies.Moon?.motionState ?? '')}`}
              </span>

              <span>
                {`${i18n('Speed')}: ${bodies.Moon?.speed}° ${i18n('a day')}`}
              </span>
            </div>
          </div>

          <div className={styles.item}>
            <div className={`${styles.button} ${styles.neptune}`}>
              <img
                width={20}
                height={20}
                src={'/assets/images/horoscope/neptune.png'}
                className={styles.planet}
                ref={addElement}
                data-planet={'neptune'}
              />
              {i18n('Neptune')}
              <Zodiac
                className={styles.sign}
                type={'small'}
                sign={bodies.Neptune?.sign}
              />
            </div>

            <div className={styles.description}>
              <span>
                {`${i18n('Absolute position')}: ${bodies.Neptune?.absPos}°`}
              </span>

              <span>
                {`${i18n('Sign')}: ${bodies.Neptune?.degreeInSign}° ${i18n('in')} ${i18n(bodies?.Neptune?.signId ?? '')}`}
              </span>

              <span>
                {`${i18n('Motion state')}: ${i18n(bodies.Neptune?.motionState ?? '')}`}
              </span>

              <span>
                {`${i18n('Speed')}: ${bodies.Neptune?.speed}° ${i18n('a day')}`}
              </span>
            </div>
          </div>

          <div className={styles.item}>
            <div className={`${styles.button} ${styles.uranus}`}>
              <img
                width={35}
                height={20}
                src={'/assets/images/horoscope/uranus.png'}
                className={styles.planet}
                ref={addElement}
                data-planet={'uranus'}
              />
              {i18n('Uranus')}
              <Zodiac
                className={styles.sign}
                type={'small'}
                sign={bodies.Uranus?.sign}
              />
            </div>

            <div className={styles.description}>
              <span>
                {`${i18n('Absolute position')}: ${bodies.Uranus?.absPos}°`}
              </span>

              <span>
                {`${i18n('Sign')}: ${bodies.Uranus?.degreeInSign}° ${i18n('in')} ${i18n(bodies?.Uranus?.signId ?? '')}`}
              </span>

              <span>
                {`${i18n('Motion state')}: ${i18n(bodies.Uranus?.motionState ?? '')}`}
              </span>

              <span>
                {`${i18n('Speed')}: ${bodies.Uranus?.speed}° ${i18n('a day')}`}
              </span>
            </div>
          </div>

          <div className={styles.item}>
            <div className={`${styles.button} ${styles.saturn}`}>
              <img
                width={40}
                height={20}
                src={'/assets/images/horoscope/saturn.png'}
                className={styles.planet}
                ref={addElement}
                data-planet={'saturn'}
              />
              {i18n('Saturn')}
              <Zodiac
                className={styles.sign}
                type={'small'}
                sign={bodies.Saturn?.sign}
              />
            </div>

            <div className={styles.description}>
              <span>
                {`${i18n('Absolute position')}: ${bodies.Saturn?.absPos}°`}
              </span>

              <span>
                {`${i18n('Sign')}: ${bodies.Saturn?.degreeInSign}° ${i18n('in')} ${i18n(bodies?.Saturn?.signId ?? '')}`}
              </span>

              <span>
                {`${i18n('Motion state')}: ${i18n(bodies.Saturn?.motionState ?? '')}`}
              </span>

              <span>
                {`${i18n('Speed')}: ${bodies.Saturn?.speed}° ${i18n('a day')}`}
              </span>
            </div>
          </div>

          <div className={styles.item}>
            <div className={`${styles.button} ${styles.jupiter}`}>
              <img
                width={20}
                height={20}
                src={'/assets/images/horoscope/jupiter.png'}
                className={styles.planet}
                ref={addElement}
                data-planet={'jupiter'}
              />
              {i18n('Jupiter')}
              <Zodiac
                className={styles.sign}
                type={'small'}
                sign={bodies.Jupiter?.sign}
              />
            </div>

            <div className={styles.description}>
              <span>
                {`${i18n('Absolute position')}: ${bodies.Jupiter?.absPos}°`}
              </span>

              <span>
                {`${i18n('Sign')}: ${bodies.Jupiter?.degreeInSign}° ${i18n('in')} ${i18n(bodies?.Jupiter?.signId ?? '')}`}
              </span>

              <span>
                {`${i18n('Motion state')}: ${i18n(bodies.Jupiter?.motionState ?? '')}`}
              </span>

              <span>
                {`${i18n('Speed')}: ${bodies.Jupiter?.speed}° ${i18n('a day')}`}
              </span>
            </div>
          </div>

          <div className={styles.item}>
            <div className={`${styles.button} ${styles.pluto}`}>
              <img
                width={20}
                height={20}
                src={'/assets/images/horoscope/pluto.png'}
                className={styles.planet}
                ref={addElement}
                data-planet={'pluto'}
              />
              {i18n('Pluto')}
              <Zodiac
                className={styles.sign}
                type={'small'}
                sign={bodies.Pluto?.sign}
              />
            </div>

            <div className={styles.description}>
              <span>
                {`${i18n('Absolute position')}: ${bodies.Pluto?.absPos}°`}
              </span>

              <span>
                {`${i18n('Sign')}: ${bodies.Pluto?.degreeInSign}° ${i18n('in')} ${i18n(bodies?.Pluto?.signId ?? '')}`}
              </span>

              <span>
                {`${i18n('Motion state')}: ${i18n(bodies.Pluto?.motionState ?? '')}`}
              </span>

              <span>
                {`${i18n('Speed')}: ${bodies.Pluto?.speed}° ${i18n('a day')}`}
              </span>
            </div>
          </div>
        </div>
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
