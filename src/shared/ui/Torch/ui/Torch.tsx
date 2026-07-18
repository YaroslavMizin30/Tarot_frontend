import { type FC } from 'react';

import type { TorchProps } from './Torch.props';

import styles from './Torch.module.css';

const Torch: FC<TorchProps> = (props) => {
  const { style = {}, className = '', delay } = props;

  return (
    <div className={`${styles.torch} ${className}`} style={style}>
      <div className={styles.flame} style={{ animationDelay: delay }}>
        <div className={styles.red} style={{ animationDelay: delay }}></div>
        <div className={styles.yellow} style={{ animationDelay: delay }}></div>
        <div className={styles.red} style={{ animationDelay: delay }}></div>
        <div className={styles.blue}></div>
        <div className={styles.wick}></div>
      </div>
      <div className={styles.stick}>
        <span className={styles.waxUpper} />
        <span className={styles.waxLower} />
      </div>
      <div className={styles.bottom}></div>
    </div>
  );
};

export default Torch;
