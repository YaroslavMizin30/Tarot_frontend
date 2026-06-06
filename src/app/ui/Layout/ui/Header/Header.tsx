import { useState } from 'react';
import { useNavigate } from 'react-router';

import SettingsIcon from '@/shared/assets/svg/common/settings.svg';
import HomeIcon from '@/shared/assets/svg/common/home.svg';
import GlobeIcon from '@/shared/assets/svg/common/globe.svg';
import useOutsideClick from '@/shared/hooks/useOutsideClick';
import useLocales, { type Locale } from '@/shared/hooks/useLocales';
import { useUserData } from '@/entities/User';

import styles from './Header.module.css';

const LANGS: { name: string; locale: Locale }[] = [
  { name: 'English', locale: 'en' },
  { name: 'Русский', locale: 'ru' },
];

const Header = () => {
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);
  const { userData } = useUserData();

  const handleSettingsClick = () => {
    if (userData) {
      navigate('/settings');
    }
  };

  const handleHomeClick = () => {
    if (userData) {
      navigate('/');
    }
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
      <HomeIcon
        className={styles.home}
        onClick={handleHomeClick}
        styles={{ opacity: userData ? 1 : 0 }}
      />

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
          styles={{ opacity: userData ? 1 : 0 }}
        />
      </div>
    </header>
  );
};

export default Header;
