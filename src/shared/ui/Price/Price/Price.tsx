import Pentacle from '../../Pentacle';

import type { PriceProps } from './Price.props';

import styles from './Price.module.css';

export const Price = (props: PriceProps) => {
  const { cost } = props;

  return (
    <div className={styles.price}>
      <span className={styles.cost}>{cost}</span>

      <Pentacle className={styles.pentacle} svgClassName={styles.svg} />
    </div>
  );
};
