import { useEffect, useState, type MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router';

import useLocales from '@/shared/hooks/useLocales';
import Button from '@/shared/ui/Button';
import ArrowButton from '@/shared/ui/ArrowButton';

import UserAgreement from '@/pages/Settings/ui/UserAgreement/UserAgreement';
import RatingSettings from '@/pages/Settings/ui/RatingSettings/RatingSettings';

import TRANSLATIONS_EN from '@/shared/locales/en/settings';
import TRANSLATIONS_RU from '@/shared/locales/ru/settings';

import styles from './AboutApp.module.css';

type AboutAppSection = '' | 'user agreement' | 'rate the app';

interface AboutAppLocationState {
  returnTo?: string;
  section?: AboutAppSection;
}

export const AboutAppPage = () => {
  const location = useLocation();
  const locationState = location.state as AboutAppLocationState | null;
  const initialSection = locationState?.section ?? '';
  const [section, setSection] = useState<AboutAppSection>(initialSection);

  const { i18n, addTranslations, locale } = useLocales();

  const navigate = useNavigate();

  useEffect(() => {
    addTranslations({
      en: TRANSLATIONS_EN,
      ru: TRANSLATIONS_RU,
    });
  }, [addTranslations, locale]);

  const handleSectionButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    setSection(e.currentTarget.value as AboutAppSection);
  };

  const handleBackButtonClick = () => {
    if (initialSection) {
      navigate(locationState?.returnTo ?? '/settings');
      return;
    }

    setSection('');
  };

  const renderContent = () => {
    switch (section) {
      case 'user agreement':
        return <UserAgreement onBackButtonClick={handleBackButtonClick} />;
      case 'rate the app':
        return <RatingSettings onBackButtonClick={handleBackButtonClick} />;
      default:
        return (
          <>
            <h3 className={styles.title}>{i18n('About App')}</h3>
            <p className={styles.description}>
              {i18n('Tarotopia brings Tarot, astrology and personal observations together in one space')}
            </p>

            <div className={styles.menu}>
              <Button
                onClick={handleSectionButtonClick}
                value={'user agreement'}
                className={styles.button}
              >
                {i18n('User agreement')}
              </Button>

              <Button
                onClick={handleSectionButtonClick}
                value={'rate the app'}
                className={styles.button}
              >
                {i18n('Rate the app')}
              </Button>
            </div>

            <ArrowButton
              className={styles.arrow}
              onClick={() => navigate(locationState?.returnTo ?? '/settings')}
            />
          </>
        );
    }
  };

  return (
    <div className={`${styles.container} custom-scrollbar`}>
      {renderContent()}
    </div>
  );
};
