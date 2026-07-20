import {
  lazy,
  Suspense,
} from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import useLocales from '@/shared/hooks/useLocales';
import { getPendingSpreadDraft } from '@/entities/Spread';
import { useUser } from '@/entities/User';
import { queryKeys } from '@/shared/api/queryKeys';
import RouletteIcon from '@/shared/assets/svg/common/roulette_page.svg';
import { getDailyBonusStatus } from '@/entities/BonusGame';
import DeferredComposition from '@/shared/ui/DeferredComposition';
import { getDayPeriod } from '@/widgets/DaySky/lib/getDayPeriod';

import styles from './Main.module.css';

const DailyCardWidget = lazy(() => import('@/widgets/DailyCard'));
const DailyGuidanceWidget = lazy(() => import('@/widgets/DailyGuidance'));
const DailyReflection = lazy(() => import('@/widgets/DailyReflection'));
const loadDaySky = () => import('@/widgets/DaySky');

const SKY_MOUNT_DELAY = 560;
const SKY_FADE_IN_DURATION = 2400;

const MainSkeleton = ({ className = '' }: { className?: string }) => (
  <div
    aria-hidden={'true'}
    className={`${styles.skeleton} ${className}`}
  >
    <span />
    <span />
    <span />
  </div>
);

export const MainPage = () => {
  const navigate = useNavigate();
  const dayPeriod = getDayPeriod(new Date().getHours());

  const { i18n } = useLocales();
  const { user } = useUser();
  const { data: pendingDraft, isLoading: isPendingDraftLoading } = useQuery({
    queryKey: queryKeys.spreads.pending(user?.id ?? 'no-user'),
    queryFn: getPendingSpreadDraft,
    enabled: Boolean(user),
    staleTime: 0,
  });
  const { data: dailyBonus, isLoading: isDailyBonusLoading } = useQuery({
    queryKey: queryKeys.dailyBonus.all,
    queryFn: getDailyBonusStatus,
    enabled: Boolean(user),
  });
  const resumableSpread = pendingDraft?.status === 'found'
    ? pendingDraft.spread
    : null;

  return (
    <div className={`${styles.container} ${styles[dayPeriod]}`}>
      <DeferredComposition
        className={styles.skyLayer}
        delay={SKY_MOUNT_DELAY}
        fadeInDuration={SKY_FADE_IN_DURATION}
        loader={loadDaySky}
      />

      <div className={styles.content}>
        <Suspense
          fallback={<MainSkeleton className={styles.cardSkeleton} />}
        >
          <DailyCardWidget />
        </Suspense>

        <Suspense
          fallback={<MainSkeleton className={styles.guidanceSkeleton} />}
        >
          <DailyGuidanceWidget />
        </Suspense>

        <Suspense
          fallback={<MainSkeleton className={styles.reflectionSkeleton} />}
        >
          <DailyReflection />
        </Suspense>

        <div className={styles.actions}>
          {isDailyBonusLoading ? (
            <MainSkeleton className={styles.actionSkeleton} />
          ) : (
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
          )}

          <div className={styles.resumeSlot}>
            {isPendingDraftLoading ? (
              <MainSkeleton className={styles.resumeSkeleton} />
            ) : resumableSpread ? (
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
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
