import { useEffect, useState } from 'react';

/**
 * Tracks the current visual viewport height. Listens to both
 * `resize` and `visualViewport.resize` (the latter accounts for the
 * mobile address bar / Telegram mini-app header). Returns `null`
 * during SSR or if the APIs are unavailable.
 */
export const useViewportHeight = (): number | null => {
  const [height, setHeight] = useState<number | null>(() => {
    if (typeof window === 'undefined') return null;

    return window.visualViewport?.height ?? window.innerHeight;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const update = () => {
      setHeight(window.visualViewport?.height ?? window.innerHeight);
    };

    update();

    window.addEventListener('resize', update);

    window.visualViewport?.addEventListener('resize', update);

    return () => {
      window.removeEventListener('resize', update);

      window.visualViewport?.removeEventListener('resize', update);
    };
  }, []);

  return height;
};
