import {
  lazy,
  Suspense,
  useCallback,
  useState,
} from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import useLocales from '@/shared/hooks/useLocales';
import { getPendingSpreadDraft } from '@/entities/Spread';
import { useUser } from '@/entities/User';
import { queryKeys } from '@/shared/api/queryKeys';
import RouletteIcon from '@/shared/assets/svg/common/roulette_page.svg';
import { getDailyBonusStatus } from '@/entities/BonusGame';

import styles from './Main.module.css';

const DailyCardWidget = lazy(() => import('@/widgets/DailyCard'));
const DailyGuidanceWidget = lazy(() => import('@/widgets/DailyGuidance'));
const DailyReflection = lazy(() => import('@/widgets/DailyReflection'));

const CARD_READY = 1;
const GUIDANCE_READY = 2;
const REFLECTION_READY = 4;
const ALL_WIDGETS_READY = CARD_READY | GUIDANCE_READY | REFLECTION_READY;

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

const MainPageSkeleton = () => (
  <div
    aria-hidden={'true'}
    className={`${styles.content} ${styles.loadingContent}`}
  >
    <MainSkeleton className={styles.cardSkeleton} />
    <MainSkeleton className={styles.guidanceSkeleton} />
    <MainSkeleton className={styles.reflectionSkeleton} />

    <div className={styles.actions}>
      <MainSkeleton className={styles.actionSkeleton} />
      <MainSkeleton className={styles.resumeSkeleton} />
    </div>
  </div>
);

export const MainPage = () => {
  const navigate = useNavigate();

  const { i18n } = useLocales();
  const { user } = useUser();
  const [readyWidgets, setReadyWidgets] = useState(0);
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
  const handleCardReady = useCallback(() => {
    setReadyWidgets((value) => value | CARD_READY);
  }, []);
  const handleGuidanceReady = useCallback(() => {
    setReadyWidgets((value) => value | GUIDANCE_READY);
  }, []);
  const handleReflectionReady = useCallback(() => {
    setReadyWidgets((value) => value | REFLECTION_READY);
  }, []);
  const isContentReady =
    readyWidgets === ALL_WIDGETS_READY &&
    !isPendingDraftLoading &&
    !isDailyBonusLoading;

  return (
    <div className={styles.container} aria-busy={!isContentReady}>
      <div
        aria-hidden={!isContentReady}
        className={`${styles.content} ${
          isContentReady ? '' : styles.contentPending
        }`}
      >
        <Suspense fallback={null}>
          <DailyCardWidget onReady={handleCardReady} />
        </Suspense>

        <Suspense fallback={null}>
          <DailyGuidanceWidget onReady={handleGuidanceReady} />
        </Suspense>

        <Suspense fallback={null}>
          <DailyReflection onReady={handleReflectionReady} />
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

      {!isContentReady && <MainPageSkeleton />}
    </div>
  );
};
