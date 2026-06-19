import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';

import SettingsIcon from '@/shared/assets/svg/common/settings.svg';
import HomeIcon from '@/shared/assets/svg/common/home.svg';
import GlobeIcon from '@/shared/assets/svg/common/globe.svg';
import useOutsideClick from '@/shared/hooks/useOutsideClick';
import useLocales, { type Locale } from '@/shared/hooks/useLocales';
import Tooltip from '@/shared/ui/Tooltip';
import useTelegram from '@/shared/hooks/useTelegram';

import { useUser } from '@/entities/User';

import styles from './Header.module.css';

const LANGS: { name: string; locale: Locale }[] = [
  { name: 'English', locale: 'en' },
  { name: 'Русский', locale: 'ru' },
];

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [isVisible, setIsVisible] = useState(false);
  const { user } = useUser();

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
    setIsVisible(!isVisible);
  };

  const handleOutsideClick = () => {
    setIsVisible(false);
  };

  const ref = useOutsideClick(handleOutsideClick);

  const { changeLanguage, locale, i18n } = useLocales();

  const { isMobile } = useTelegram();

  return (
    <header
      className={`${styles.header} ${isMobile ? styles['header-mobile'] : ''}`}
    >
      <HomeIcon
        className={styles.home}
        onClick={handleHomeClick}
        styles={{ opacity: user ? 1 : 0 }}
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
