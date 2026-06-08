import { useEffect, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router';

import Button from '@/shared/ui/Button';
import ArrowButton from '@/shared/ui/ArrowButton';
import { useUser } from '@/entities/User';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/settings';
import TRANSLATIONS_RU from '@/shared/locales/ru/settings';

import UserSettings from './UserSettings';
import SubscriptionSettings from './SubscriptionSettings';
import RatingSettings from './RatingSettings';
import UserAgreement from './UserAgreement';

import styles from './SettingsPage.module.css';

export const SettingsPage = () => {
  const { user } = useUser();

  const { i18n, addTranslations, locale } = useLocales();

  const [settings, setSettings] = useState('');

  const navigate = useNavigate();

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
      case 'subscription':
        return (
          <SubscriptionSettings onBackButtonClick={handleBackButtonClick} />
        );
      case 'about you':
        return <UserSettings onBackButtonClick={handleBackButtonClick} />;
      case 'rate the app':
        return <RatingSettings onBackButtonClick={handleBackButtonClick} />;
      case 'user agreement':
        return <UserAgreement onBackButtonClick={handleBackButtonClick} />;
      default:
        return (
          <>
            <Button
              onClick={handleSettingsButtonClick}
              value={'subscription'}
            >
              {i18n('Subscription')}
            </Button>

            <Button
              onClick={handleSettingsButtonClick}
              value={'about you'}
            >
              {i18n('About you')}
            </Button>

            <Button
              onClick={handleSettingsButtonClick}
              value={'rate the app'}
            >
              {i18n('Rate the app')}
            </Button>

            <Button
              onClick={handleSettingsButtonClick}
              value={'user agreement'}
            >
              {i18n('User agreement')}
            </Button>

            <ArrowButton onClick={() => navigate('/')} className={styles.arrow} />
          </>
        );
    }
  };

  return (
    <div className={`${styles.container} custom-scrollbar`}>{getContent()}</div>
  );
};
