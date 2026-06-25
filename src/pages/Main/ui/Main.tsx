import { type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router';

import Button from '@/shared/ui/Button';
import useLocales from '@/shared/hooks/useLocales';

import styles from './Main.module.css';

export const MainPage = () => {
  const navigate = useNavigate();

  const handleNavigationButtonClick = (
    e: SyntheticEvent<HTMLButtonElement>,
  ) => {
    navigate(e.currentTarget.value);
  };

  const { i18n } = useLocales();

  return (
    <div className={styles.container}>
      {JSON.stringify(window.Telegram?.WebApp?.initDataUnsafe)}

      <div className={styles.menu}>
        <Button
          className={styles.menuButton}
          value={'/daily'}
          onClick={handleNavigationButtonClick}
        >
          {i18n('Card of the day')}
        </Button>

        <Button
          className={styles.menuButton}
          value={'/reading'}
          onClick={handleNavigationButtonClick}
        >
          {i18n('Make spread')}
        </Button>

        <Button
          className={styles.menuButton}
          value={'/history'}
          onClick={handleNavigationButtonClick}
        >
          {i18n('Spreads history')}
        </Button>

        <Button
          className={styles.menuButton}
          value={'/about'}
          onClick={handleNavigationButtonClick}
        >
          {i18n('About Tarot')}
        </Button>
      </div>
    </div>
  );
};
