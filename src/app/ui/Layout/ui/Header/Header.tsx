import { useState } from 'react';

import GlobeIcon from '@/shared/assets/svg/common/globe.svg';
import Theme from '@/shared/assets/svg/common/theme.svg';
import AudioOn from '@/shared/assets/svg/common/audio_on.svg';
import AudioOff from '@/shared/assets/svg/common/audio_off.svg';
import useOutsideClick from '@/shared/hooks/useOutsideClick';
import useLocales, { type Locale } from '@/shared/hooks/useLocales';

import { useUser } from '@/entities/User';

import styles from './Header.module.css';

const LANGS: { name: string; locale: Locale }[] = [
  { name: 'English', locale: 'en' },
  { name: 'Русский', locale: 'ru' },
];

const THEMES: { name: string; value: 'standard' | 'gray' | 'bronze' }[] = [
  { name: 'Standard', value: 'standard' },
  { name: 'Gray', value: 'gray' },
  { name: 'Bronze', value: 'bronze' },
];

const Header = () => {
  const [isLangSwitcherVisible, setIsLangSwitcherVisible] = useState(false);
  const [isThemeSwitcherVisible, setIsThemeSwitcherVisible] = useState(false);
  const { user, updateUser } = useUser();

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

  const handleAudioClick = async () => {
    if (!user) {
      return;
    }

    await updateUser(`${user.id}`, { audio: !user?.audio });
  };

  const { changeLanguage, locale, i18n } = useLocales();

  return (
    <header className={styles.header}>
      <div className={styles.rightSection}>
        <Theme
          ref={themeSwitcherRef}
          className={`${styles.moon} ${!user && styles.hidden}`}
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

        {user?.audio ? (
          <AudioOn
            onClick={handleAudioClick}
            className={`${styles.audio} ${!user && styles.hidden}`}
          />
        ) : (
          <AudioOff
            onClick={handleAudioClick}
            className={`${styles.audio} ${!user && styles.hidden}`}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
