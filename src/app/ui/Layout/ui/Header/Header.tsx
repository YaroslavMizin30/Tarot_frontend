import { useState } from 'react';
import { useNavigate } from 'react-router';

import Theme from '@/shared/assets/svg/common/theme.svg';
import AudioOn from '@/shared/assets/svg/common/audio_on.svg';
import AudioOff from '@/shared/assets/svg/common/audio_off.svg';
import useOutsideClick from '@/shared/hooks/useOutsideClick';
import useLocales from '@/shared/hooks/useLocales';
import Pentacle from '@/shared/ui/Pentacle';

import { useUser } from '@/entities/User';

import styles from './Header.module.css';

const THEMES: { name: string; value: 'standard' | 'gray' | 'bronze' }[] = [
  { name: 'Standard', value: 'standard' },
  { name: 'Gray', value: 'gray' },
  { name: 'Bronze', value: 'bronze' },
];

const Header = (props: { isLoading?: boolean }) => {
  const { isLoading } = props;

  const [isThemeSwitcherVisible, setIsThemeSwitcherVisible] = useState(false);
  const { user, updateUser } = useUser();
  const navigate = useNavigate();
  const { i18n } = useLocales();

  const handleThemeSwitcherClick = () => {
    setIsThemeSwitcherVisible(!isThemeSwitcherVisible);
  };

  const themeSwitcherRef = useOutsideClick<HTMLDivElement>(() =>
    setIsThemeSwitcherVisible(false),
  );

  const handleAudioClick = async () => {
    if (!user) {
      return;
    }

    await updateUser(`${user.id}`, { audio: !user?.audio });
  };

  return (
    <header className={`${styles.header} ${isLoading ? styles.loading : ''}`}>
      <button
        aria-label={i18n('Open wallet')}
        className={styles.leftSection}
        disabled={!user || isLoading}
        onClick={() => navigate('/billing')}
        type={'button'}
      >
        <span className={styles.balance}>
          {(user?.balance ?? 0) + (user?.bonusBalance ?? 0)}
        </span>

        {user && <Pentacle />}
      </button>

      <div
        className={`${styles.rightSection} ${isLoading ? styles['rightSection-loading'] : ''}`}
      >
        <div className={styles.themeControl} ref={themeSwitcherRef}>
          <button
            aria-expanded={isThemeSwitcherVisible}
            aria-haspopup={'menu'}
            aria-label={i18n('Choose theme')}
            className={styles.iconButton}
            disabled={!user}
            onClick={handleThemeSwitcherClick}
            type={'button'}
          >
            <Theme className={styles.moon} aria-hidden={true} />
          </button>

          {isThemeSwitcherVisible && (
            <div className={styles.themes} role={'menu'}>
              {THEMES.map((theme) => {
                const isSelected = theme.value === user?.theme;

                const handleThemeClick = async () => {
                  if (!user) return;

                  setIsThemeSwitcherVisible(false);
                  await updateUser(String(user.id), { theme: theme.value });
                };

                return (
                  <button
                    aria-checked={isSelected}
                    className={`${styles.theme} ${isSelected ? styles.selected : ''}`}
                    key={theme.value}
                    onClick={handleThemeClick}
                    role={'menuitemradio'}
                    type={'button'}
                  >
                    {i18n(theme.name)}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          aria-label={i18n(user?.audio ? 'Sound enabled' : 'Sound disabled')}
          aria-pressed={Boolean(user?.audio)}
          className={styles.iconButton}
          disabled={!user}
          onClick={handleAudioClick}
          type={'button'}
        >
          {user?.audio ? (
            <AudioOn className={styles.audio} aria-hidden={true} />
          ) : (
            <AudioOff className={styles.audio} aria-hidden={true} />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
