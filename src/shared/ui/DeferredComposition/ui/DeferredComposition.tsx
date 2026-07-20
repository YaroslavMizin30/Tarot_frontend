import {
  type ComponentType,
  type TransitionEvent,
  useEffect,
  useState,
} from 'react';

import styles from './DeferredComposition.module.css';

type CompositionModule = {
  default: ComponentType;
};

interface DeferredCompositionProps {
  className?: string;
  deferMotionUntilVisible?: boolean;
  delay?: number;
  fadeInDuration?: number;
  fadeInTimingFunction?: string;
  loader: () => Promise<CompositionModule>;
}

export const DeferredComposition = ({
  className = '',
  deferMotionUntilVisible = false,
  delay = 480,
  fadeInDuration = 1300,
  fadeInTimingFunction,
  loader,
}: DeferredCompositionProps) => {
  const [Composition, setComposition] =
    useState<ComponentType | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMotionReady, setIsMotionReady] = useState(
    !deferMotionUntilVisible,
  );

  useEffect(() => {
    let isCancelled = false;
    const loadTimeout = window.setTimeout(() => {
      loader()
        .then(({ default: LoadedComposition }) => {
          if (!isCancelled) {
            setComposition(() => LoadedComposition);
          }
        })
        .catch(() => undefined);
    }, delay);

    return () => {
      isCancelled = true;
      window.clearTimeout(loadTimeout);
    };
  }, [delay, loader]);

  useEffect(() => {
    if (!Composition) {
      return;
    }

    let firstFrame = 0;
    let secondFrame = 0;

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [Composition]);

  const handleTransitionEnd = (
    event: TransitionEvent<HTMLDivElement>,
  ) => {
    if (
      event.currentTarget === event.target &&
      event.propertyName === 'opacity' &&
      isVisible
    ) {
      setIsMotionReady(true);
    }
  };

  return (
    <div
      aria-hidden={'true'}
      className={`${styles.layer} ${
        isVisible ? styles.visible : ''
      } ${
        isVisible && !isMotionReady ? styles.revealing : ''
      } ${
        deferMotionUntilVisible && !isMotionReady
          ? styles.motionDeferred
          : ''
      } ${className}`}
      onTransitionEnd={handleTransitionEnd}
      style={
        isVisible
          ? {
            transitionDuration: `${fadeInDuration}ms`,
            transitionTimingFunction: fadeInTimingFunction,
          }
          : undefined
      }
    >
      {Composition && <Composition />}
    </div>
  );
};

export default DeferredComposition;
