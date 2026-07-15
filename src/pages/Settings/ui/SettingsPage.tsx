import { useEffect, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router';

import Button from '@/shared/ui/Button';
import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/settings';
import TRANSLATIONS_RU from '@/shared/locales/ru/settings';
import TRANSLATIONS_EN_CARDS from '@/shared/locales/en/cards';
import TRANSLATIONS_RU_CARDS from '@/shared/locales/ru/cards';
import Spinner from '@/shared/ui/Spinner';
import Zodiac from '@/shared/ui/Zodiac';

import UserSettings from './UserAgreement/UserSettings';

import { useUser } from '@/entities/User';
import { useSpreads } from '@/entities/Spread';
import TarotCard, { getCardInfoI18n } from '@/entities/TarotCard';

import { combineAllCards } from '../lib/combineAllCard';
import { findMostFrequentCard } from '../lib/findMostFrequentCard';
import Loyalty from './Loyalty/ui/Loyalty';

import styles from './SettingsPage.module.css';

export const SettingsPage = () => {
  const { user } = useUser();

  const { i18n, addTranslations, locale } = useLocales();

  const [settings, setSettings] = useState('');

  const navigate = useNavigate();

  const { spreads, isLoading } = useSpreads();

  const cards = combineAllCards(spreads);
  const card = findMostFrequentCard(cards);

  const mostFrequentCardInfo = card
    ? getCardInfoI18n(card.name, i18n)
    : undefined;

  useEffect(() => {
    addTranslations({
      en: { ...TRANSLATIONS_EN, ...TRANSLATIONS_EN_CARDS },
      ru: { ...TRANSLATIONS_RU, ...TRANSLATIONS_RU_CARDS },
    });
  }, [locale]);

  const handleSettingsButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    setSettings(e.currentTarget.value);
  };

  const handleAboutAppButtonClick = () => {
    navigate('/about-app');
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

                  <div className={styles['card-wrapper']}>
                    {card && mostFrequentCardInfo ? (
                      <TarotCard
                        name={card.name}
                        localizedName={mostFrequentCardInfo.name}
                      />
                    ) : (
                      <span>{i18n('No card yet')}</span>
                    )}
                  </div>
                </div>

                {card && mostFrequentCardInfo && (
                  <div className={`${styles['card-info']} custom-scrollbar`}>
                    <p className={styles['card-meanings']}>
                      <span className={styles['card-meanings-label']}>
                        {i18n('Meanings')}
                      </span>
                      <span>{mostFrequentCardInfo.meanings}</span>
                    </p>

                    <p className={styles['card-description']}>
                      {mostFrequentCardInfo.description}
                    </p>
                  </div>
                )}
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
                onClick={handleAboutAppButtonClick}
                className={styles.button}
              >
                {i18n('About App')}
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
