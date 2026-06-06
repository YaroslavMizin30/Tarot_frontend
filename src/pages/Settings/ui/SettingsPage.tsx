import { useEffect, useState, type MouseEvent } from 'react';

import { useUserData } from '@/entities/User';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/settings';
import TRANSLATIONS_RU from '@/shared/locales/ru/settings';
import Button from '@/shared/ui/Button';

import UserSettings from './UserSettings';
import SubscriptionSettings from './SubscriptionSettings';

import styles from './SettingsPage.module.css';

export const SettingsPage = () => {
  const { userData } = useUserData();

  const { i18n, addTranslations, locale } = useLocales();

  const [settings, setSettings] = useState('');

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  const handleSettingsButtonClick = (
    e: MouseEvent<HTMLButtonElement>,
  ) => {
    setSettings(e.currentTarget.value);
  };

  const handleBackButtonClick = () => {
    setSettings('');
  };

  if (!userData) {
    return null;
  }

  const getContent = () => {
    switch (settings) {
      case 'subscription':
        return <SubscriptionSettings onBackButtonClick={handleBackButtonClick}/>;
      case 'about you':
        return <UserSettings onBackButtonClick={handleBackButtonClick} />;
      default:
        return (
          <>
            <Button onClick={handleSettingsButtonClick} value={'subscription'}>
              {i18n('Subscription')}
            </Button>

            <Button onClick={handleSettingsButtonClick} value={'about you'}>
              {i18n('About you')}
            </Button>
          </>
        );
    }
  };

  return (
    <div className={`${styles.container} custom-scrollbar`}>
      {getContent()}
    </div>
  );
};
