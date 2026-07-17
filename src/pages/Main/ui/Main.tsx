import { type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router';

import Button from '@/shared/ui/Button';
import useLocales from '@/shared/hooks/useLocales';
import DailyCardWidget from '@/widgets/DailyCard';

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
      <DailyCardWidget />

      <div className={styles.menu}>
        <Button
          className={styles.primaryAction}
          value={'/reading'}
          onClick={handleNavigationButtonClick}
        >
          {i18n('Make spread')}
        </Button>

        <button
          className={styles.secondaryAction}
          value={'/history'}
          onClick={handleNavigationButtonClick}
        >
          <span>{i18n('Spreads history')}</span>
          <span aria-hidden={'true'}>→</span>
        </button>

        <button
          className={styles.secondaryAction}
          value={'/about'}
          onClick={handleNavigationButtonClick}
        >
          <span>{i18n('About Tarot')}</span>
          <span aria-hidden={'true'}>→</span>
        </button>
      </div>
    </div>
  );
};
