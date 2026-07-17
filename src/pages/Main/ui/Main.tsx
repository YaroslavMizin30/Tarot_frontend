import { useNavigate } from 'react-router';

import useLocales from '@/shared/hooks/useLocales';
import { isSpreadDraftId, useSpreads } from '@/entities/Spread';
import DailyCardWidget from '@/widgets/DailyCard';
import DailyGuidanceWidget from '@/widgets/DailyGuidance';
import DailyReflection from '@/widgets/DailyReflection';
import RouletteIcon from '@/shared/assets/svg/common/roulette_page.svg';

import styles from './Main.module.css';

export const MainPage = () => {
  const navigate = useNavigate();

  const { i18n } = useLocales();
  const { spreads } = useSpreads();

  const resumableSpread = spreads
    ?.filter(({ spreadId, status }) =>
      isSpreadDraftId(spreadId) &&
      (status === 'draft' || status === 'charged' || status === 'failed')
    )
    .sort((first, second) =>
      (second.updatedAt ?? second.date).localeCompare(
        first.updatedAt ?? first.date,
      )
    )[0];

  return (
    <div className={styles.container}>
      <DailyCardWidget />

      <DailyGuidanceWidget />

      <DailyReflection />

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

        <div className={styles.resumeSlot}>
          {resumableSpread && (
            <button
              className={styles.resume}
              onClick={() =>
                navigate(`/tarot?draft=${resumableSpread.spreadId}`)
              }
              type={'button'}
            >
              <span className={styles.resumeText}>
                <strong>{i18n('Continue spread')}</strong>
                <span>
                  {resumableSpread.title ||
                    resumableSpread.question ||
                    i18n('Your unfinished spread')}
                </span>
              </span>
              <span className={styles.arrow} aria-hidden={'true'}>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
