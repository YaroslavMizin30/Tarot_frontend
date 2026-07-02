import { type FC } from 'react';

import Zodiac from '@/shared/ui/Zodiac';
import useLocales from '@/shared/hooks/useLocales';

import type { CircleProps } from './Circle.props';

import styles from './Circle.module.css';

export const Circle: FC<CircleProps> = (props) => {
  const { bodies, className = '' } = props;

  const { i18n } = useLocales();

  const zodiacDegrees = {
    aries: 0,
    taurus: 30,
    gemini: 60,
    cancer: 90,
    leo: 120,
    virgo: 150,
    libra: 180,
    scorpio: 210,
    sagittarius: 240,
    capricorn: 270,
    aquarius: 300,
    pisces: 330,
  };

  return (
    <div className={`${styles.circle} ${className}`}>
      <div className={styles.line}></div>
      <div className={styles.line} style={{ transform: 'rotate(30deg)' }} />
      <div className={styles.line} style={{ transform: 'rotate(60deg)' }} />
      <div className={styles.line} style={{ transform: 'rotate(90deg)' }} />
      <div className={styles.line} style={{ transform: 'rotate(120deg)' }} />
      <div className={styles.line} style={{ transform: 'rotate(150deg)' }} />

      <Zodiac
        type={'small'}
        sign={'Aquarius'}
        className={`${styles.zodiac} ${styles.Aquarius}`}
      />
      <span
        className={styles.name}
        style={{ top: '33px', left: '19px', transform: 'rotate(-45deg)' }}
      >
        {i18n('Aquarius')}
      </span>

      <Zodiac
        type={'small'}
        sign={'Pisces'}
        className={`${styles.zodiac} ${styles.Pisces}`}
      />
      <span
        className={styles.name}
        style={{ top: '83px', left: '-10px', transform: 'rotate(-77deg)' }}
      >
        {i18n('Pisces')}
      </span>

      <Zodiac
        type={'small'}
        sign={'Aries'}
        className={`${styles.zodiac} ${styles.Aries}`}
      />
      <span
        className={styles.name}
        style={{ bottom: '83px', left: '-10px', transform: 'rotate(75deg)' }}
      >
        {i18n('Aries')}
      </span>

      <Zodiac
        type={'small'}
        sign={'Taurus'}
        className={`${styles.zodiac} ${styles.Taurus}`}
      />
      <span
        className={styles.name}
        style={{ bottom: '33px', left: '19px', transform: 'rotate(45deg)' }}
      >
        {i18n('Taurus')}
      </span>

      <Zodiac
        type={'small'}
        sign={'Gemini'}
        className={`${styles.zodiac} ${styles.Gemini}`}
      />
      <span
        className={styles.name}
        style={{ bottom: '4px', left: '70px', transform: 'rotate(13deg)' }}
      >
        {i18n('Gemini')}
      </span>

      <Zodiac
        type={'small'}
        sign={'Cancer'}
        className={`${styles.zodiac} ${styles.Cancer}`}
      />
      <span
        className={styles.name}
        style={{ bottom: '4px', right: '70px', transform: 'rotate(-13deg)' }}
      >
        {i18n('Cancer')}
      </span>

      <Zodiac
        type={'small'}
        sign={'Leo'}
        className={`${styles.zodiac} ${styles.Leo}`}
      />
      <span
        className={styles.name}
        style={{ bottom: '33px', right: '19px', transform: 'rotate(-45deg)' }}
      >
        {i18n('Leo')}
      </span>

      <Zodiac
        type={'small'}
        sign={'Virgo'}
        className={`${styles.zodiac} ${styles.Virgo}`}
      />
      <span
        className={styles.name}
        style={{ bottom: '83px', right: '-10px', transform: 'rotate(-75deg)' }}
      >
        {i18n('Virgo')}
      </span>

      <Zodiac
        type={'small'}
        sign={'Libra'}
        className={`${styles.zodiac} ${styles.Libra}`}
      />
      <span
        className={styles.name}
        style={{ top: '83px', right: '-10px', transform: 'rotate(77deg)' }}
      >
        {i18n('Libra')}
      </span>

      <Zodiac
        type={'small'}
        sign={'Scorpio'}
        className={`${styles.zodiac} ${styles.Scorpio}`}
      />
      <span
        className={styles.name}
        style={{ top: '33px', right: '19px', transform: 'rotate(45deg)' }}
      >
        {i18n('Scorpio')}
      </span>

      <Zodiac
        type={'small'}
        sign={'Sagittarius'}
        className={`${styles.zodiac} ${styles.Sagittarius}`}
      />
      <span
        className={styles.name}
        style={{ top: '4px', right: '70px', transform: 'rotate(13deg)' }}
      >
        {i18n('Sagittarius')}
      </span>

      <Zodiac
        type={'small'}
        sign={'Capricorn'}
        className={`${styles.zodiac} ${styles.Capricorn}`}
      />
      <span
        className={styles.name}
        style={{ top: '4px', left: '70px', transform: 'rotate(-13deg)' }}
      >
        {i18n('Capricorn')}
      </span>

      <span className={styles.degree} style={{ left: '-17px' }}>
        0°
      </span>

      <span className={styles.degree} style={{ left: '-5px', bottom: '40px' }}>
        30°
      </span>

      <span className={styles.degree} style={{ left: '45px', bottom: '-5px' }}>
        60°
      </span>

      <span
        className={styles.degree}
        style={{ left: '108px', bottom: '-20px' }}
      >
        90°
      </span>

      <span className={styles.degree} style={{ right: '37px', bottom: '-5px' }}>
        120°
      </span>

      <span
        className={styles.degree}
        style={{ right: '-10px', bottom: '45px' }}
      >
        150°
      </span>

      <span className={styles.degree} style={{ right: '-28px' }}>
        180°
      </span>

      <span className={styles.degree} style={{ right: '-10px', top: '42px' }}>
        210°
      </span>

      <span className={styles.degree} style={{ right: '35px', top: '-3px' }}>
        240°
      </span>

      <span className={styles.degree} style={{ top: '-17px' }}>
        270°
      </span>

      <span className={styles.degree} style={{ left: '35px', top: '0px' }}>
        300°
      </span>

      <span className={styles.degree} style={{ left: '-15px', top: '46px' }}>
        330°
      </span>

      <div className={styles.inner}>
        <div
          className={styles.orbit}
          style={{
            transform:
              bodies.Sun &&
              `rotate(-${zodiacDegrees[bodies.Sun?.signId] + bodies.Sun?.degreeInSign}deg)`,
          }}
        >
          <div className={styles['orbit-inner']}>
            {bodies.Sun ? (
              <div
                className={styles.planet}
                style={{
                  top: 'calc(50% - 12px)',
                  boxShadow: '0px 0px 30px 16px #ff7b00',
                }}
              >
                <img
                  src={'/assets/images/horoscope/sun.png'}
                  width={'180%'}
                  height={'180%'}
                />
              </div>
            ) : null}
          </div>
        </div>

        <div
          className={styles.orbit}
          style={{
            transform:
              bodies.Jupiter &&
              `rotate(-${zodiacDegrees[bodies.Jupiter?.signId] + bodies.Jupiter?.degreeInSign}deg)`,
          }}
        >
          <div className={styles['orbit-inner']}>
            {bodies.Jupiter ? (
              <div
                className={styles.planet}
                style={{ top: 'calc(50% + 20px)' }}
              >
                <img
                  src={'/assets/images/horoscope/jupiter.png'}
                  width={'240%'}
                  height={'120%'}
                />
              </div>
            ) : null}
          </div>
        </div>

        <div
          className={styles.orbit}
          style={{
            transform:
              bodies.Saturn &&
              `rotate(-${zodiacDegrees[bodies.Saturn?.signId] + bodies.Saturn?.degreeInSign}deg)`,
          }}
        >
          <div className={styles['orbit-inner']}>
            {bodies.Saturn ? (
              <div
                className={styles.planet}
                style={{ top: 'calc(50% - 12px)' }}
              >
                <img
                  src={'/assets/images/horoscope/saturn.png'}
                  width={'240%'}
                  height={'120%'}
                />
              </div>
            ) : null}
          </div>
        </div>

        <div
          className={styles.orbit}
          style={{
            transform:
              bodies.Uranus?.signId &&
              `rotate(-${zodiacDegrees[bodies.Uranus?.signId] + bodies.Uranus?.degreeInSign}deg)`,
          }}
        >
          <div className={styles['orbit-inner']}>
            {bodies.Uranus ? (
              <div
                className={`${styles.planet} ${styles.uranus}`}
                style={{ top: 'calc(50% - 14px)' }}
              >
                <img
                  src={'/assets/images/horoscope/uranus.png'}
                  width={'180%'}
                  height={'90%'}
                />
              </div>
            ) : null}
          </div>
        </div>

        <div
          className={styles.orbit}
          style={{
            transform:
              bodies.Neptune &&
              `rotate(-${zodiacDegrees[bodies.Neptune?.signId] + bodies.Neptune?.degreeInSign}deg)`,
          }}
        >
          <div className={styles['orbit-inner']}>
            {bodies.Neptune ? (
              <div
                className={`${styles.planet} ${styles.neptune}`}
                style={{ top: 'calc(50% - 15px)' }}
              >
                <img
                  src={'/assets/images/horoscope/neptune.png'}
                  width={'85%'}
                  height={'85%'}
                />
              </div>
            ) : null}
          </div>
        </div>

        <div
          className={styles.orbit}
          style={{
            transform:
              bodies.Venus &&
              `rotate(-${zodiacDegrees[bodies.Venus?.signId] + bodies.Venus?.degreeInSign}deg)`,
          }}
        >
          <div className={styles['orbit-inner']}>
            {bodies.Venus ? (
              <div
                className={`${styles.planet} ${styles.venus}`}
                style={{ top: 'calc(50% - 15px)' }}
              >
                <img
                  src={'/assets/images/horoscope/venus.png'}
                  width={'85%'}
                  height={'85%'}
                />
              </div>
            ) : null}
          </div>
        </div>

        <div
          className={styles.orbit}
          style={{
            transform:
              bodies.Mars?.signId &&
              `rotate(-${zodiacDegrees[bodies.Mars?.signId] + bodies.Mars?.degreeInSign}deg)`,
          }}
        >
          <div className={styles['orbit-inner']}>
            {bodies.Mars ? (
              <div
                className={`${styles.planet} ${styles.mars}`}
                style={{ top: 'calc(50% - 19px)' }}
              >
                <img
                  src={'/assets/images/horoscope/mars.png'}
                  width={'55%'}
                  height={'55%'}
                />
              </div>
            ) : null}
          </div>
        </div>

        <div
          className={styles.orbit}
          style={{
            transform:
              bodies.Mercury?.signId &&
              `rotate(-${zodiacDegrees[bodies.Mercury?.signId] + bodies.Mercury?.degreeInSign}deg)`,
          }}
        >
          <div className={styles['orbit-inner']}>
            {bodies.Mercury ? (
              <div
                className={`${styles.planet} ${styles.mercury}`}
                style={{ top: 'calc(50% - 18px)' }}
              >
                <img
                  src={'/assets/images/horoscope/mercury.png'}
                  width={'60%'}
                  height={'60%'}
                />
              </div>
            ) : null}
          </div>
        </div>

        <div
          className={styles.orbit}
          style={{
            transform:
              bodies.Moon?.signId &&
              `rotate(-${zodiacDegrees[bodies.Moon?.signId] + bodies.Moon?.degreeInSign}deg)`,
          }}
        >
          <div className={styles['orbit-inner']}>
            {bodies.Moon ? (
              <div
                className={`${styles.planet} ${styles.moon}`}
                style={{ top: 'calc(50% - 20px)' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    boxShadow: '0px 0px 10px 5px #fff',
                    borderRadius: '50%',
                    width: '30%',
                    height: '30%',
                    bottom: '1px',
                    right: '2px',
                  }}
                />

                <img
                  src={'/assets/images/horoscope/moon.png'}
                  width={'50%'}
                  height={'50%'}
                  style={{ zIndex: 1 }}
                />
              </div>
            ) : null}
          </div>
        </div>

        <div
          className={styles.orbit}
          style={{
            transform:
              bodies.Pluto?.signId &&
              `rotate(-${zodiacDegrees[bodies.Pluto?.signId] + bodies.Pluto?.degreeInSign}deg)`,
          }}
        >
          <div className={styles['orbit-inner']}>
            {bodies.Pluto ? (
              <div
                className={`${styles.planet} ${styles.pluto}`}
                style={{ top: 'calc(50% - 21px)' }}
              >
                <img
                  src={'/assets/images/horoscope/pluto.png'}
                  width={'40%'}
                  height={'40%'}
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className={styles.houses}>
          <span
            className={styles.house}
            style={{ left: '7px', top: '35px', transform: 'rotate(75deg)' }}
          >
            1
          </span>

          <span
            className={styles.house}
            style={{ left: '14px', top: '48px', transform: 'rotate(45deg)' }}
          >
            2
          </span>

          <span
            className={styles.house}
            style={{ left: '25px', top: '55px', transform: 'rotate(15deg)' }}
          >
            3
          </span>

          <span
            className={styles.house}
            style={{ right: '25px', top: '55px', transform: 'rotate(-15deg)' }}
          >
            4
          </span>

          <span
            className={styles.house}
            style={{ right: '14px', top: '48px', transform: 'rotate(-45deg)' }}
          >
            5
          </span>

          <span
            className={styles.house}
            style={{ right: '7px', top: '35px', transform: 'rotate(-75deg)' }}
          >
            6
          </span>

          <span
            className={styles.house}
            style={{
              right: '7px',
              bottom: '35px',
              transform: 'rotate(-115deg)',
            }}
          >
            7
          </span>

          <span
            className={styles.house}
            style={{
              right: '14px',
              bottom: '48px',
              transform: 'rotate(-135deg)',
            }}
          >
            8
          </span>

          <span
            className={styles.house}
            style={{
              right: '25px',
              bottom: '55px',
              transform: 'rotate(-165deg)',
            }}
          >
            9
          </span>

          <span
            className={styles.house}
            style={{
              left: '22px',
              bottom: '56px',
              transform: 'rotate(-195deg)',
            }}
          >
            10
          </span>

          <span
            className={styles.house}
            style={{
              left: '11px',
              bottom: '48px',
              transform: 'rotate(135deg)',
            }}
          >
            11
          </span>

          <span
            className={styles.house}
            style={{
              left: '3px',
              bottom: '35px',
              transform: 'rotate(115deg)',
            }}
          >
            12
          </span>

          <div className={styles['line-inner']}></div>
          <div
            className={styles['line-inner']}
            style={{ transform: 'rotate(90deg)' }}
          />
          <div
            className={styles['line-inner']}
            style={{ transform: 'rotate(30deg)' }}
          />
          <div
            className={styles['line-inner']}
            style={{ transform: 'rotate(60deg)' }}
          />
          <div
            className={styles['line-inner']}
            style={{ transform: 'rotate(120deg)' }}
          />
          <div
            className={styles['line-inner']}
            style={{ transform: 'rotate(150deg)' }}
          />
        </div>
      </div>
    </div>
  );
};
