import { useEffect, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router';

import useLocales from '@/shared/hooks/useLocales';
import Button from '@/shared/ui/Button';
import ArrowButton from '@/shared/ui/ArrowButton';

import UserAgreement from '@/pages/Settings/ui/UserAgreement/UserAgreement';
import RatingSettings from '@/pages/Settings/ui/RatingSettings/RatingSettings';

import TRANSLATIONS_EN from '@/shared/locales/en/settings';
import TRANSLATIONS_RU from '@/shared/locales/ru/settings';

import styles from './AboutApp.module.css';

export const AboutAppPage = () => {
  const [section, setSection] = useState('');

  const { i18n, addTranslations, locale } = useLocales();

  const navigate = useNavigate();

  useEffect(() => {
    addTranslations({
      en: TRANSLATIONS_EN,
      ru: TRANSLATIONS_RU,
    });
  }, [locale]);

  const handleSectionButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    setSection(e.currentTarget.value);
  };

  const handleBackButtonClick = () => {
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
              onClick={() => navigate('/settings')}
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
