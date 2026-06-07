import { useState } from 'react';

import { useUser, useSubscription } from '@/entities/User';

import useLocales from '@/shared/hooks/useLocales';
import { getPluralForm } from '@/shared/utils/getPluralForm';
import Arrow from '@/shared/assets/svg/common/deck-arrow.svg';

import styles from './SettingsPage.module.css';

const SubscriptionSettings = (props: { onBackButtonClick: () => void }) => {
  const { onBackButtonClick } = props;

  const { user } = useUser();

  const { i18n } = useLocales();

  const { isExpired, daysLeft, tariff, leftFreeSpreads } = useSubscription();

  const [options, setOptions] = useState<string[]>([]);
  const [title, setTitle] = useState<string>(i18n('Subscription'));

  const handleBackButtonClick = () => {
    if (options.length) {
      setOptions([]);

      setTitle(i18n('Subscription'));

      return;
    }

    onBackButtonClick();
  };

  if (!user) {
    return null;
  }

  const getContent = () => {
    switch (tariff) {
      case 'trial':
        return (
          <div className={styles.tariff}>
            <h4 className={styles.subtitle}>
              {i18n('Your tariff')}: {i18n('Trial')}
            </h4>

            <ul>
              <li>{`${i18n("You've got")} ${leftFreeSpreads} ${getPluralForm(leftFreeSpreads, [i18n('free (1)'), i18n('free (2)'), i18n('free (3)')])} ${getPluralForm(leftFreeSpreads, [i18n('spreads (1)'), i18n('spreads (2)'), i18n('spreads (3)')])}`}</li>
              <li>{`${i18n('You can buy subscription via telegram bot')}`}</li>
            </ul>
          </div>
        );
      case 'standard':
        return (
          <div className={styles.tariff}>
            <h4 className={styles.subtitle}>
              {i18n('Your tariff')}: {i18n('Standard')}
            </h4>
            {isExpired ? (
              <ul>
                <li>{i18n('Subscription is expired')}</li>
                <li>{i18n('You can extend subscription via telegram bot')}</li>
              </ul>
            ) : (
              <span>{`${i18n('Subscription is valid for another')} ${daysLeft} ${getPluralForm(daysLeft, [i18n('days (1)'), i18n('days (2)'), i18n('days (3)')])}`}</span>
            )}

            {!isExpired && (
              <div className={styles.capabilities}>
                <h4 className={styles.subtitle}>{i18n('Available to you')}:</h4>

                <ul>
                  <li>{i18n('daily predictions')}</li>
                  <li>{i18n('monthly predictions')}</li>
                  <li>{i18n('daily card')}</li>
                  <li>{`${i18n('spreads up to')} 5 ${i18n('cards')}`}</li>
                  <li>{`5 ${i18n('spreads a day')}`}</li>
                </ul>
              </div>
            )}
          </div>
        );
      case 'extended':
        return (
          <div className={styles.tariff}>
            <h4 className={styles.subtitle}>
              {i18n('Your tariff')}: {i18n('Extended')}
            </h4>
            {isExpired ? (
              <span>
                {i18n('Subscription is expired')}
                {i18n('You can extend subscription via telegram bot')}
              </span>
            ) : (
              <span>{`${i18n('Subscription is valid for another')} ${daysLeft} ${getPluralForm(daysLeft, [i18n('days (1)'), i18n('days (2)'), i18n('days (3)')])}`}</span>
            )}

            {!isExpired && (
              <div className={styles.capabilities}>
                <h4 className={styles.title}>{i18n('Available to you')}:</h4>

                <ul>
                  <li>{i18n('daily predictions')}</li>
                  <li>{i18n('monthly predictions')}</li>
                  <li>{i18n('daily card')}</li>
                  <li>{`${i18n('spreads up to')} 9 ${i18n('cards')}`}</li>
                  <li>{`10 ${i18n('spreads a day')}`}</li>
                  <li>{i18n('predictions summary')}</li>
                  <li>{i18n('spreads summary')}</li>
                </ul>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.section}> {getContent()}</div>
      <Arrow
        width={30}
        height={30}
        className={styles.arrow}
        onClick={handleBackButtonClick}
      />
    </>
  );
};

export default SubscriptionSettings;
