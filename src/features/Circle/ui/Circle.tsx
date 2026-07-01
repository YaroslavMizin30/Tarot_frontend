import { type FC } from 'react';

import Zodiac from '@/shared/ui/Zodiac';
import useLocales from '@/shared/hooks/useLocales';

import type { CircleProps } from './Circle.props';

import styles from './Circle.module.css';

export const Circle: FC<CircleProps> = (props) => {
  const { positions, className = '' } = props;

  const { i18n } = useLocales();

  const planetPositions = {
    aries: {
      bottom: '92px',
      left: '55px',
    },
    taurus: {
      bottom: '68px',
      left: '68px',
    },
    gemini: {
      bottom: '55px',
      left: '92px',
    },
    cancer: {
      bottom: '55px',
      right: '92px',
    },
    leo: {
      bottom: '68px',
      right: '68px',
    },
    virgo: {
      bottom: '92px',
      right: '55px',
    },
    libra: {
      top: '92px',
      right: '55px',
    },
    scorpio: {
      top: '68px',
      right: '68px',
    },
    sagittarius: {
      top: '55px',
      right: '92px',
    },
    capricorn: {
      top: '55px',
      left: '92px',
    },
    aquarius: {
      top: '68px',
      left: '68px',
    },
    pisces: {
      top: '92px',
      left: '55px',
    },
  };

  return (
    <div className={`${styles.circle} ${className}`}>
      {positions.sun ? (
        <div
          className={styles.planet}
          style={{
            ...planetPositions[positions.sun],
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

      {positions.jupiter ? (
        <div
          className={styles.planet}
          style={planetPositions[positions.jupiter]}
        >
          <img
            src={'/assets/images/horoscope/jupiter.png'}
            width={'240%'}
            height={'120%'}
          />
        </div>
      ) : null}

      {positions.saturn ? (
        <div
          className={styles.planet}
          style={planetPositions[positions.saturn]}
        >
          <img
            src={'/assets/images/horoscope/saturn.png'}
            width={'240%'}
            height={'120%'}
          />
        </div>
      ) : null}

      {positions.uranus ? (
        <div
          className={`${styles.planet} ${styles.uranus}`}
          style={planetPositions[positions.uranus]}
        >
          <img
            src={'/assets/images/horoscope/uranus.png'}
            width={'180%'}
            height={'90%'}
          />
        </div>
      ) : null}

      {positions.neptune ? (
        <div
          className={`${styles.planet} ${styles.neptune}`}
          style={planetPositions[positions.neptune]}
        >
          <img
            src={'/assets/images/horoscope/neptune.png'}
            width={'85%'}
            height={'85%'}
          />
        </div>
      ) : null}

      {positions.venus ? (
        <div
          className={`${styles.planet} ${styles.venus}`}
          style={planetPositions[positions.venus]}
        >
          <img
            src={'/assets/images/horoscope/venus.png'}
            width={'85%'}
            height={'85%'}
          />
        </div>
      ) : null}

      {positions.mars ? (
        <div
          className={`${styles.planet} ${styles.mars}`}
          style={planetPositions[positions.mars]}
        >
          <img
            src={'/assets/images/horoscope/mars.png'}
            width={'55%'}
            height={'55%'}
          />
        </div>
      ) : null}

      {positions.mercury ? (
        <div
          className={`${styles.planet} ${styles.mercury}`}
          style={planetPositions[positions.mercury]}
        >
          <img
            src={'/assets/images/horoscope/mercury.png'}
            width={'60%'}
            height={'60%'}
          />
        </div>
      ) : null}

      {positions.moon ? (
        <div
          className={`${styles.planet} ${styles.moon}`}
          style={{ ...planetPositions[positions.moon] }}
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

      {positions.pluto ? (
        <div
          className={`${styles.planet} ${styles.pluto}`}
          style={planetPositions[positions.pluto]}
        >
          <img
            src={'/assets/images/horoscope/pluto.png'}
            width={'40%'}
            height={'40%'}
          />
        </div>
      ) : null}

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
