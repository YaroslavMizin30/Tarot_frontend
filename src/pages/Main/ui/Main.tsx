import { useNavigate } from 'react-router';

import Button from '@/shared/ui/Button';
import useLocales from '@/shared/hooks/useLocales';
import DailyCardWidget from '@/widgets/DailyCard';
import DailyGuidanceWidget from '@/widgets/DailyGuidance';
import RouletteIcon from '@/shared/assets/svg/common/roulette_page.svg';

import styles from './Main.module.css';

export const MainPage = () => {
  const navigate = useNavigate();

  const { i18n } = useLocales();

  return (
    <div className={styles.container}>
      <DailyCardWidget />

      <DailyGuidanceWidget />

      <div className={styles.actions}>
        <button
          type={'button'}
          className={styles.bonus}
          onClick={() => navigate('/roulette')}
        >
          <span className={styles.bonusIcon} aria-hidden={'true'}>
            <RouletteIcon />
          </span>

          <span className={styles.bonusText}>
            <strong>{i18n('Daily roulette')}</strong>
            <span>{i18n('Bonuses and surprises')}</span>
          </span>

          <span className={styles.arrow} aria-hidden={'true'}>→</span>
        </button>

        <Button
          className={styles.primaryAction}
          onClick={() => navigate('/tarot')}
        >
          {i18n('Go to Tarot')}
        </Button>
      </div>
    </div>
  );
};
