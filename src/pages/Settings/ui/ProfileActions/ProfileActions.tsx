import { useState } from 'react';
import { useNavigate } from 'react-router';

import AstrologyIcon from '@/shared/assets/svg/common/astrology_page.svg';
import SettingsIcon from '@/shared/assets/svg/common/settings.svg';
import TarotIcon from '@/shared/assets/svg/common/tarot_page.svg';
import { useUser, type UserProfileChanges } from '@/entities/User';
import { Personalization } from '@/features/Questions';
import useLocales from '@/shared/hooks/useLocales';
import Modal from '@/shared/ui/Modal';

import styles from './ProfileActions.module.css';

const THEMES = [
  { label: 'Standard', value: 'standard' },
  { label: 'Gray', value: 'gray' },
  { label: 'Bronze', value: 'bronze' },
] as const;

const HistoryIcon = () => (
  <svg viewBox={'0 0 24 24'} aria-hidden={true}>
    <path d={'M4.4 8.2A8.5 8.5 0 1 1 3.5 13'} />
    <path d={'M4.4 3.8v4.4H8.8M12 7.5V12l3.1 1.9'} />
  </svg>
);

export const ProfileActions = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const { changeLanguage, i18n, locale } = useLocales();
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updatePreference = async (data: UserProfileChanges) => {
    if (!user || isSaving) return;

    setIsSaving(true);
    try {
      await updateUser(data);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <nav className={styles.grid} aria-label={i18n('Profile sections')}>
        <button
          className={`${styles.action} ${styles.natal}`}
          onClick={() =>
            navigate('/natal-chart', { state: { returnTo: '/settings' } })
          }
          type={'button'}
        >
          <span className={styles.copy}>
            <strong>{i18n('Natal chart')}</strong>
            <small>{i18n('Chart and birth data')}</small>
          </span>
          <AstrologyIcon className={styles.icon} aria-hidden={true} />
        </button>

        <Personalization
          renderTrigger={({ completed, open, progress, total }) => (
            <button
              className={`${styles.action} ${styles.tarot}`}
              onClick={open}
              type={'button'}
            >
              <span
                aria-hidden={true}
                className={styles.progress}
                style={{ width: `${progress}%` }}
              />
              <span className={styles.copy}>
                <strong>{i18n('Tarot personalization')}</strong>
                <small>{completed} {i18n('of')} {total}</small>
              </span>
              <TarotIcon className={styles.icon} aria-hidden={true} />
            </button>
          )}
        />

        <button
          className={`${styles.action} ${styles.history}`}
          onClick={() => navigate('/history')}
          type={'button'}
        >
          <span className={styles.copy}>
            <strong>{i18n('Reading history')}</strong>
            <small>{i18n('Saved spreads')}</small>
          </span>
          <span className={styles.icon}><HistoryIcon /></span>
        </button>

        <button
          className={`${styles.action} ${styles.settings}`}
          onClick={() => setIsPreferencesOpen(true)}
          type={'button'}
        >
          <span className={styles.copy}>
            <strong>{i18n('Settings')}</strong>
            <small>{i18n('Language, theme and sound')}</small>
          </span>
          <SettingsIcon className={styles.icon} aria-hidden={true} />
        </button>
      </nav>

      <Modal
        className={styles.preferences}
        contentClassName={styles.preferencesContent}
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      >
        <span className={styles.eyebrow}>{i18n('Profile')}</span>
        <h2>{i18n('Settings')}</h2>

        <section className={styles.preferenceGroup}>
          <h3>{i18n('Language')}</h3>
          <div className={styles.options}>
            <button
              className={locale === 'ru' ? styles.selected : ''}
              onClick={() => changeLanguage('ru')}
              type={'button'}
            >
              Русский
            </button>
            <button
              className={locale === 'en' ? styles.selected : ''}
              onClick={() => changeLanguage('en')}
              type={'button'}
            >
              English
            </button>
          </div>
        </section>

        <section className={styles.preferenceGroup}>
          <h3>{i18n('Theme')}</h3>
          <div className={styles.options}>
            {THEMES.map((theme) => (
              <button
                className={user?.theme === theme.value ? styles.selected : ''}
                disabled={isSaving}
                key={theme.value}
                onClick={() => updatePreference({ theme: theme.value })}
                type={'button'}
              >
                {i18n(theme.label)}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.preferenceGroup}>
          <h3>{i18n('Sound')}</h3>
          <button
            aria-pressed={Boolean(user?.audio)}
            className={styles.soundToggle}
            disabled={isSaving}
            onClick={() => updatePreference({ audio: !user?.audio })}
            type={'button'}
          >
            <span>{i18n(user?.audio ? 'Sound enabled' : 'Sound disabled')}</span>
            <span className={styles.switch} aria-hidden={true} />
          </button>
        </section>
      </Modal>
    </>
  );
};

export default ProfileActions;
