import { useEffect, useState, type MouseEvent } from 'react';

import Button from '@/shared/ui/Button';
import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/settings';
import TRANSLATIONS_RU from '@/shared/locales/ru/settings';
import Spinner from '@/shared/ui/Spinner';
import Zodiac from '@/shared/ui/Zodiac';

import UserSettings from './UserAgreement/UserSettings';
import RatingSettings from './RatingSettings/RatingSettings';
import UserAgreement from './UserAgreement/UserAgreement';

import { useUser } from '@/entities/User';
import { useSpreads } from '@/entities/Spread';
import TarotCard from '@/entities/TarotCard';

import { combineAllCards } from '../lib/combineAllCard';
import { findMostFrequentCard } from '../lib/findMostFrequentCard';
import Loyalty from './Loyalty/ui/Loyalty';

import styles from './SettingsPage.module.css';

export const SettingsPage = () => {
  const { user } = useUser();

  const { i18n, addTranslations, locale } = useLocales();

  const [settings, setSettings] = useState('');

  const { spreads, isLoading } = useSpreads();

  const cards = combineAllCards(spreads);
  const card = findMostFrequentCard(cards);

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  const handleSettingsButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    setSettings(e.currentTarget.value);
  };

  const handleBackButtonClick = () => {
    setSettings('');
  };

  if (!user) {
    return null;
  }

  const getContent = () => {
    switch (settings) {
      case 'profile':
        return <UserSettings onBackButtonClick={handleBackButtonClick} />;
      case 'rate the app':
        return <RatingSettings onBackButtonClick={handleBackButtonClick} />;
      case 'user agreement':
        return <UserAgreement onBackButtonClick={handleBackButtonClick} />;
      default:
        return (
          <>
            <div className={styles.info}>
              {user.userName && (
                <div className={styles.user}>
                  <span className={styles['user-name']}>{user.userName}</span>

                  <Zodiac sign={user.sign} type={'small'} />
                </div>
              )}

              <div className={styles['card-container']}>
                <div className={styles.card}>
                  <span className={styles['card-title']}>
                    {i18n('Most frequent card')}
                  </span>

                  {card && (
                    <TarotCard
                      name={card.name}
                      localizedName={i18n(card.name)}
                    />
                  )}
                </div>
              </div>

              <Loyalty />
            </div>

            <div className={styles.menu}>
              <Button
                onClick={handleSettingsButtonClick}
                value={'profile'}
                className={styles.button}
              >
                {i18n('Natal chart')}
              </Button>

              <Button
                onClick={handleSettingsButtonClick}
                value={'rate the app'}
                className={styles.button}
              >
                {i18n('Rate the app')}
              </Button>

              <Button
                onClick={handleSettingsButtonClick}
                value={'user agreement'}
                className={styles.button}
              >
                {i18n('User agreement')}
              </Button>
            </div>
          </>
        );
    }
  };

  if (isLoading) {
    return <Spinner size={'l'} />;
  }

  return (
    <div className={`${styles.container} custom-scrollbar`}>{getContent()}</div>
  );
};
