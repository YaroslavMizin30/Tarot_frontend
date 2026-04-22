import { type FC } from 'react';

import { SIGNS } from '../config/signs';

import type { ZodiacProps } from './Zodiac.props';

import styles from './Zodiac.module.css';

export const Zodiac: FC<ZodiacProps> = (props) => {
  const { sign, className = '' } = props;

  return (
    <div className={`${styles.container} ${className}`}>
      {sign ? (
        <img
          src={`assets/images/zodiac/${SIGNS[sign]}.png`}
          className={styles.image}
        />
      ) : null}
    </div>
  );
};
