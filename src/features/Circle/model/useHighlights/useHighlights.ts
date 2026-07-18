import { useState, useRef, useEffect } from 'react';

export const useHighlights = (params: {
  onHighLight?: (isHighlighted: boolean, body: string | null) => void;
  onElementVisibility?: (isVisible: boolean, element: Element) => void;
  threshold?: number;
  //eslint-disable-next-line
  deps?: any[];
}) => {
  const {
    onHighLight,
    onElementVisibility,
    threshold = 1,
    deps,
  } = params;

  const rootRef = useRef(null);
  const elementsRef = useRef<Array<HTMLElement>>([]);

  const [highlightedBodies, setHighlightedBodies] = useState({
    moon: false,
    sun: false,
    jupiter: false,
    saturn: false,
    uranus: false,
    neptune: false,
    pluto: false,
    mars: false,
    venus: false,
    mercury: false,
    lilith: false,
    north_node: false,
    chiron: false,
    taurus: false,
    gemini: false,
    cancer: false,
    leo: false,
    virgo: false,
    libra: false,
    scorpio: false,
    sagittarius: false,
    capricorn: false,
    aquarius: false,
    pisces: false,
    aries: false,
    house_1: false,
    house_2: false,
    house_3: false,
    house_4: false,
    house_5: false,
    house_6: false,
    house_7: false,
    house_8: false,
    house_9: false,
    house_10: false,
    house_11: false,
    house_12: false,
  });

  const highlightBody = (isHighlighted: boolean, body: string | null) => {
    if (body) {
      setHighlightedBodies((prev) => ({ ...prev, [body]: isHighlighted }));
    }
  };

  const addElement = (el: HTMLElement | null) => {
    if (el) {
      elementsRef.current?.push(el);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          onElementVisibility?.(entry.isIntersecting, entry.target);

          if (onHighLight) {
            onHighLight(
              entry.isIntersecting,
              entry.target.getAttribute('data-planet') ??
                entry.target.getAttribute('data-zodiac') ??
                entry.target.getAttribute('data-house'),
            );
          } else {
            highlightBody(
              entry.isIntersecting,
              entry.target.getAttribute('data-planet') ??
                entry.target.getAttribute('data-zodiac') ??
                entry.target.getAttribute('data-house'),
            );
          }
        });
      },
      { root: rootRef.current, threshold },
    );

    if (elementsRef.current) {
      elementsRef.current.forEach((el) => {
        observer.observe(el);
      });
    }
  }, deps ?? []);

  return { highlightedBodies, elementsRef, rootRef, addElement };
};
