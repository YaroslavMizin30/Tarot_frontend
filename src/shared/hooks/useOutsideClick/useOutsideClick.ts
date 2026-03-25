import { useEffect, useRef } from 'react';

import type { Callback } from './types';

export const useOutsideClick = (callback: Callback) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (event: Event) => {
      if (
        ref.current &&
        !(ref.current as HTMLElement).contains(event.target as Node)
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
