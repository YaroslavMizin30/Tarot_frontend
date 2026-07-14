import { useMemo } from 'react';

import useLocales from '@/shared/hooks/useLocales';
import Pentacle from '@/shared/ui/Pentacle';
import Discount from '@/shared/assets/svg/roulette/discount.svg';

import { useSpreads } from '@/entities/Spread';

import { calculateReadingStats } from '@/pages/Settings/lib/loyalty';

import { LOYALTY_TIERS } from '../../../config/loyalty';

import styles from './Loyalty.module.css';

const Loyalty = () => {
  const { i18n } = useLocales();

  const { spreads } = useSpreads();

  const { longestStreak, readingsThisMonth } = calculateReadingStats(
    spreads ?? [],
  );

  const level = useMemo(() => {
    if (!spreads) {
      return;
    }

    return LOYALTY_TIERS.find((tier) => {
      const {
        conditions: { spreadSeries, spreadsPerMonth },
      } = tier;

      if (
        spreadSeries >= longestStreak ||
        spreadsPerMonth >= readingsThisMonth
      ) {
        return true;
      }

      return false;
    });
  }, [spreads, longestStreak, readingsThisMonth]);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{`${i18n('Loyalty tier')}`}</h3>

      <div className={styles.tiers}>
        {LOYALTY_TIERS.map((tier, index) => {
          const { name, icon } = tier;

          const isCurrent = level?.name === name;

          return (
            <div className={styles.tier}>
              {index > 0 && (
                <div
                  className={`${styles.line} ${styles['line-left']} ${isCurrent ? styles.current : ''}`}
                />
              )}
              <div
                className={`${styles.icon} ${isCurrent ? styles.current : ''}`}
              >
                {icon}
              </div>
              {index < LOYALTY_TIERS.length - 1 && (
                <div
                  className={`${styles.line} ${styles['line-right']} ${isCurrent ? styles.current : ''}`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className={`${styles.loyalty} custom-scrollbar`}>
        {LOYALTY_TIERS.map((tier, index) => {
          const {
            conditions: { spreadSeries, spreadsPerMonth },
            bonus,
            name,
            icon,
          } = tier;

          const isCurrent = level?.name === name;

          if (!index) {
            return null;
          }

          return (
            <div className={styles.item} key={name}>
              <div className={styles.description}>
                <span
                  className={`${styles.name} ${isCurrent ? styles['current-text'] : ''}`}
                >
                  {i18n(name)}&nbsp;&nbsp;&nbsp;<span className={styles.icon}>{icon}</span>
                </span>

                <div className={styles.conditions}>
                  <>
                    {' '}
                    {i18n('Acquired after')} {spreadSeries}{' '}
                    {i18n('spreads in a row each day')} {i18n('OR')}{' '}
                    {spreadsPerMonth} {i18n('spreads in a month')}
                  </>
                </div>

                <ul className={styles.bonuses}>
                  {bonus.map((b) => {
                    const { type, value, description } = b;

                    return (
                      <li>
                        <div className={styles.bonus}>
                          {value} {i18n(description)}{' '}
                          {type === 'coins' && (
                            <Pentacle className={styles.coin} />
                          )}
                          {type === 'discount' && (
                            <Discount className={styles.discount} />
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Loyalty;
