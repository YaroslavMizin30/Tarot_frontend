import { useMemo } from 'react';

import DeferredComposition from '@/shared/ui/DeferredComposition';
import { getDayPeriod } from '@/widgets/DaySky/lib/getDayPeriod';

import {
  getRouteScene,
  loadDaySky,
  loadStarsComposition,
  loadTorchComposition,
} from './loaders';

import styles from './RouteTransitionBackdrop.module.css';

interface RouteTransitionBackdropProps {
  canMountHeavyCompositions: boolean;
  currentPathname: string;
  isAuthShell: boolean;
  isAuthLoadingVisible: boolean;
  isNavigating: boolean;
  pendingPathname?: string;
}

const HEAVY_FADE_IN_DURATION = 3600;
const HEAVY_MOUNT_DELAY = 120;
const HEAVY_FADE_CURVE = 'cubic-bezier(0.37, 0, 0.63, 1)';

export const RouteTransitionBackdrop = ({
  canMountHeavyCompositions,
  currentPathname,
  isAuthShell,
  isAuthLoadingVisible,
  isNavigating,
  pendingPathname,
}: RouteTransitionBackdropProps) => {
  const dayPeriod = getDayPeriod(new Date().getHours());
  const currentScene = getRouteScene(currentPathname);
  const pendingScene = pendingPathname
    ? getRouteScene(pendingPathname)
    : null;
  const hasIncomingScene = Boolean(
    pendingScene && pendingScene !== currentScene,
  );

  const visibleScenes = useMemo(() => {
    if (!pendingScene || pendingScene === currentScene) {
      return [currentScene];
    }

    return [currentScene, pendingScene];
  }, [currentScene, pendingScene]);

  if (isAuthShell) {
    return (
      <div className={styles.backdrop}>
        {!isAuthLoadingVisible && (
          <DeferredComposition delay={0} loader={loadStarsComposition} />
        )}
      </div>
    );
  }

  return (
    <div className={styles.backdrop}>
      {visibleScenes.map((scene) => (
        <div
          className={`${styles.scene} ${styles[`${scene}-${dayPeriod}`] ?? styles[scene]} ${
            hasIncomingScene && scene === pendingScene
              ? styles.incomingScene
              : ''
          }`}
          key={scene}
        >
          {scene === 'default' && (
            <>
              <div className={styles.cloud} />
              <div className={styles.cloudBottom} />
            </>
          )}
        </div>
      ))}

      {canMountHeavyCompositions &&
        visibleScenes.map((scene) => {
          const isExiting = Boolean(
            isNavigating && pendingScene && scene === currentScene &&
              scene !== pendingScene,
          );

          if (scene === 'main') {
            return (
              <DeferredComposition
                deferMotionUntilVisible
                delay={HEAVY_MOUNT_DELAY}
                fadeInDuration={HEAVY_FADE_IN_DURATION}
                fadeInTimingFunction={HEAVY_FADE_CURVE}
                isExiting={isExiting}
                key={scene}
                loader={loadDaySky}
              />
            );
          }

          if (scene === 'tarot') {
            return (
              <DeferredComposition
                deferMotionUntilVisible
                delay={HEAVY_MOUNT_DELAY}
                fadeInDuration={HEAVY_FADE_IN_DURATION}
                fadeInTimingFunction={HEAVY_FADE_CURVE}
                isExiting={isExiting}
                key={scene}
                loader={loadTorchComposition}
              />
            );
          }

          if (scene === 'astrology') {
            return (
              <DeferredComposition
                isExiting={isExiting}
                key={scene}
                loader={loadStarsComposition}
              />
            );
          }

          return null;
        })}
    </div>
  );
};

export default RouteTransitionBackdrop;
