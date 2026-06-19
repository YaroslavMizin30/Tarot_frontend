import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';

import SettingsIcon from '@/shared/assets/svg/common/settings.svg';
import HomeIcon from '@/shared/assets/svg/common/home.svg';
import GlobeIcon from '@/shared/assets/svg/common/globe.svg';
import Theme from '@/shared/assets/svg/common/theme.svg';
import useOutsideClick from '@/shared/hooks/useOutsideClick';
import useLocales, { type Locale } from '@/shared/hooks/useLocales';
import Tooltip from '@/shared/ui/Tooltip';

import { useUser } from '@/entities/User';

import styles from './Header.module.css';

const LANGS: { name: string; locale: Locale }[] = [
  { name: 'English', locale: 'en' },
  { name: 'Русский', locale: 'ru' },
];

const THEMES: { name: string; value: 'standard' | 'gray' }[] = [
  { name: 'Standard', value: 'standard' },
  { name: 'Gray', value: 'gray' },
];

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [isLangSwitcherVisible, setIsLangSwitcherVisible] = useState(false);
  const [isThemeSwitcherVisible, setIsThemeSwitcherVisible] = useState(false);
  const { user, updateUser } = useUser();

  const handleSettingsClick = () => {
    if (user) {
      navigate('/settings');
    }
  };

  const handleHomeClick = () => {
    if (user) {
      navigate('/');
    }
  };

  const handleLangSwitcherClick = () => {
    setIsLangSwitcherVisible(!isLangSwitcherVisible);
  };

  const handleThemeSwitcherClick = () => {
    setIsThemeSwitcherVisible(!isThemeSwitcherVisible);
  };

  const langSwitcherRef = useOutsideClick(() =>
    setIsLangSwitcherVisible(false),
  );

  const themeSwitcherRef = useOutsideClick(() =>
    setIsThemeSwitcherVisible(false),
  );

  const { changeLanguage, locale, i18n } = useLocales();

  return (
    <header className={styles.header}>
      <HomeIcon
        className={styles.home}
        onClick={handleHomeClick}
        styles={{ opacity: user ? 1 : 0 }}
      />

      <div className={styles.rightSection}>
        <Theme
          ref={themeSwitcherRef}
          className={styles.moon}
          onClick={handleThemeSwitcherClick}
        />

        {isThemeSwitcherVisible && (
          <div className={styles.themes}>
            {THEMES.map((theme) => {
              const handleThemeClick = async () => {
                if (!user) {
                  return;
                }

                await updateUser(String(user.id), { theme: theme.value });
              };

              return (
                <div
                  key={theme.value}
                  className={`${styles.theme} ${theme.value === user?.theme ? styles.selected : ''}`}
                  onClick={handleThemeClick}
                >
                  {i18n(theme.name)}
                </div>
              );
            })}
          </div>
        )}

        <GlobeIcon
          ref={langSwitcherRef}
          className={styles.globe}
          onClick={handleLangSwitcherClick}
        />

        {isLangSwitcherVisible && (
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

        <Tooltip
          isEnabled={pathname === '/settings'}
          position={'left'}
          style={{ position: 'relative', top: '3px' }}
          content={i18n('Already here')}
          tooltipClassName={styles.tooltip}
        >
          <SettingsIcon
            className={styles.settings}
            onClick={handleSettingsClick}
            styles={{ opacity: user ? 1 : 0 }}
          />
        </Tooltip>
      </div>
    </header>
  );
};

export default Header;
