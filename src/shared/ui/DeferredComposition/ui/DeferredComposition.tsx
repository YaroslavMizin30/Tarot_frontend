import { type ComponentType, useEffect, useState } from 'react';

import styles from './DeferredComposition.module.css';

type CompositionModule = {
  default: ComponentType;
};

interface DeferredCompositionProps {
  className?: string;
  delay?: number;
  fadeInDuration?: number;
  fadeInTimingFunction?: string;
  isExiting?: boolean;
  loader: () => Promise<CompositionModule>;
}

export const DeferredComposition = ({
  className = '',
  delay = 480,
  fadeInDuration = 1300,
  fadeInTimingFunction,
  isExiting = false,
  loader,
}: DeferredCompositionProps) => {
  const [Composition, setComposition] =
    useState<ComponentType | null>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <div
      aria-hidden={'true'}
      className={`${styles.layer} ${isVisible && !isExiting ? styles.visible : ''} ${className}`}
      style={
        isVisible && !isExiting
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
