import { useEffect, useRef, type RefObject } from 'react';

import type { Callback } from './types';

export const useOutsideClick = <T extends HTMLElement = HTMLElement>(
  callback: Callback,
): RefObject<T | null> => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const handleClick = (event: Event) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        callback();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [callback]);

  return ref;
};
