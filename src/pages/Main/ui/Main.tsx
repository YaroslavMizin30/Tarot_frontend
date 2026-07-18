import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import useLocales from '@/shared/hooks/useLocales';
import { getPendingSpreadDraft } from '@/entities/Spread';
import { useUser } from '@/entities/User';
import { queryKeys } from '@/shared/api/queryKeys';
import DailyCardWidget from '@/widgets/DailyCard';
import DailyGuidanceWidget from '@/widgets/DailyGuidance';
import DailyReflection from '@/widgets/DailyReflection';
import RouletteIcon from '@/shared/assets/svg/common/roulette_page.svg';
import { getDailyBonusStatus } from '@/entities/BonusGame';

import styles from './Main.module.css';

export const MainPage = () => {
  const navigate = useNavigate();

  const { i18n } = useLocales();
  const { user } = useUser();
  const { data: pendingDraft } = useQuery({
    queryKey: queryKeys.spreads.pending(user?.id ?? 'no-user'),
    queryFn: getPendingSpreadDraft,
    enabled: Boolean(user),
    staleTime: 0,
  });
  const { data: dailyBonus } = useQuery({
    queryKey: queryKeys.dailyBonus.all,
    queryFn: getDailyBonusStatus,
    enabled: Boolean(user),
  });
  const resumableSpread = pendingDraft?.status === 'found'
    ? pendingDraft.spread
    : null;

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
            <span>
              {i18n(
                dailyBonus?.status === 'already_played'
                  ? 'Daily card opened'
                  : 'Daily card available',
              )}
              {' · '}
              {i18n('Bonus balance')}: {dailyBonus?.bonusBalance ?? 0}
            </span>
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
