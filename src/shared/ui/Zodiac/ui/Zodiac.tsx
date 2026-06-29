import { type FC } from 'react';

import { SIGNS } from '../config/signs';

import AquariusIcon from '@/shared/assets/svg/zodiac/aquarius.svg';
import AriesIcon from '@/shared/assets/svg/zodiac/aries.svg';
import CancerIcon from '@/shared/assets/svg/zodiac/cancer.svg';
import CapricornIcon from '@/shared/assets/svg/zodiac/capricorn.svg';
import GeminiIcon from '@/shared/assets/svg/zodiac/gemini.svg';
import LeoIcon from '@/shared/assets/svg/zodiac/leo.svg';
import LibraIcon from '@/shared/assets/svg/zodiac/libra.svg';
import PiscesIcon from '@/shared/assets/svg/zodiac/pisces.svg';
import SagittariusIcon from '@/shared/assets/svg/zodiac/sagittarius.svg';
import ScorpioIcon from '@/shared/assets/svg/zodiac/scorpio.svg';
import TaurusIcon from '@/shared/assets/svg/zodiac/taurus.svg';
import VirgoIcon from '@/shared/assets/svg/zodiac/virgo.svg';

import type { ZodiacProps } from './Zodiac.props';

import styles from './Zodiac.module.css';

export const Zodiac: FC<ZodiacProps> = (props) => {
  const { sign, className = '', type = 'big' } = props;

  const getImage = () => {
    if (!sign) {
      return null;
    }

    if (type === 'big') {
      return (
        <img
          src={`assets/images/zodiac/${SIGNS[sign]}.png`}
          className={styles.image}
        />
      );
    }

    if (type === 'small') {
      switch (sign) {
        case 'Aquarius':
          return <AquariusIcon className={styles['zodiac-small']} />;
        case 'Aries':
          return <AriesIcon className={styles['zodiac-small']} />;
        case 'Cancer':
          return <CancerIcon className={styles['zodiac-small']} />;
        case 'Capricorn':
          return <CapricornIcon className={styles['zodiac-small']} />;
        case 'Gemini':
          return <GeminiIcon className={styles['zodiac-small']} />;
        case 'Leo':
          return <LeoIcon className={styles['zodiac-small']} />;
        case 'Libra':
          return <LibraIcon className={styles['zodiac-small']} />;
        case 'Pisces':
          return <PiscesIcon className={styles['zodiac-small']} />;
        case 'Sagittarius':
          return <SagittariusIcon className={styles['zodiac-small']} />;
        case 'Scorpio':
          return <ScorpioIcon className={styles['zodiac-small']} />;
        case 'Taurus':
          return <TaurusIcon className={styles['zodiac-small']} />;
        case 'Virgo':
          return <VirgoIcon className={styles['zodiac-small']} />;
        default:
          return null;
      }
    }
  };

  return (
    <div
      className={`${styles.container} ${className} ${type === 'small' ? styles.small : ''}`}
    >
      {type === 'small' && (
        <div className={styles['light-container']}>
          <div className={`${styles.light} ${styles[sign ?? '']}`}></div>

          <div className={`${styles['light2']} ${styles[`light2-${sign}`]}`} />
        </div>
      )}

      {getImage()}
    </div>
  );
};
