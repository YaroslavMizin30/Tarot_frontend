import type { FC } from 'react';
import type { TariffButtonProps } from './TariffButton.props';

import useLocales from '@/shared/hooks/useLocales';

import Pentacle from '@/shared/ui/Pentacle';

import styles from './TariffButton.module.css';

const TariffButton: FC<TariffButtonProps> = (props) => {
  const {
    prices,
    amount,
    className = '',
    addition,
    onTariffSelect,
    ...rest
  } = props;

  const { i18n } = useLocales();

  const handleTariffSelect = () => {
    onTariffSelect({ prices, amount, addition, ...rest });
  };

  return (
    <div
      className={`${styles.button} ${className}`}
      onClick={handleTariffSelect}
    >
      <div className={styles.amount}>
        <Pentacle className={styles.pentacle} />

        <div className={styles['amount-description']}>
          <div className={styles['amount-price']}>{amount}</div>
          <span className={styles['amount-currency-name']}>
            {i18n('coins')}
          </span>
        </div>
      </div>

      <div className={styles['right-section']}>
        <div className={styles.prices}>
          {i18n('for')}&nbsp;
          {prices.map((item, index) => {
            const { currency, price } = item;

            const isFollowing = index !== prices.length - 1;

            return (
              <div className={styles.price} key={`${price}-${index}`}>
                {price}&nbsp;{currency} {isFollowing ? i18n('or') : null}
              </div>
            );
          })}
        </div>

        {addition && <div className={styles.addition}>{i18n(addition)}</div>}
      </div>
    </div>
  );
};

export default TariffButton;
