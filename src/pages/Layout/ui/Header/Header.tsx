import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import SettingsIcon from '@/shared/assets/svg/common/settings.svg?react';
import HomeIcon from '@/shared/assets/svg/common/home.svg?react';
import GlobeIcon from '@/shared/assets/svg/common/globe.svg?react';
import useOutsideClick from '@/shared/hooks/useOutsideClick';
import useLocales, { type Locale } from '@/shared/hooks/useLocales';

import styles from './Header.module.css';

const LANGS: { name: string; locale: Locale }[] = [
  { name: 'English', locale: 'en' },
  { name: 'Русский', locale: 'ru' },
];

const Header = () => {
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleLangSwitcherClick = () => {
    setIsVisible(!isVisible);
  };

  const handleOutsideClick = () => {
    setIsVisible(false);
  };

  const ref = useOutsideClick(handleOutsideClick);

  const { changeLanguage, locale } = useLocales();

  return (
    <header className={styles.header}>
      <HomeIcon className={styles.home} onClick={handleHomeClick} />

      <span className={styles.title}>Tarotopia</span>

      <div className={styles.rightSection}>
        <GlobeIcon
          ref={ref}
          className={styles.globe}
          onClick={handleLangSwitcherClick}
        />

        {isVisible && (
          <div className={styles.langs}>
            {LANGS.map((lang) => {
              const handleLocaleClick = () => {
                changeLanguage(lang.locale);
              };

              return (
                <div
                  key={lang.locale}
                  className={`${styles.lang} ${locale === lang.locale ? styles.selected : ''}`}
                  onClick={handleLocaleClick}
                >
                  {lang.name}
                </div>
              );
            })}
          </div>
        )}

        <SettingsIcon
          className={styles.settings}
          onClick={handleSettingsClick}
        />
      </div>
    </header>
  );
};

export default Header;
