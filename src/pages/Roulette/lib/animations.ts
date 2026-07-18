export const animateCard = (element: HTMLDivElement) => {
  return element.animate(
    [
      {
        transform: 'translateY(0px) scale(1)',
        opacity: 1,
        filter: 'blur(0px)',
        offset: 0,
      },
      {
        transform: 'translateY(50px) scale(0.6)',
        opacity: 0,
        offset: 0.01,
      },
      {
        transform: 'translateY(100px) scale(0.6)',
        opacity: 0.5,
        filter: 'blur(5px)',
        offset: 0.25,
      },
      {
        transform: 'translateY(100px) scale(1.15)',
        opacity: 1,
        filter: 'blur(0)',
        offset: 0.5,
      },
      {
        transform: 'translateY(100px) scale(2)',
        opacity: 1,
        filter: 'blur(0)',
        offset: 0.75,
      },
      {
        transform: 'translateY(100px) scale(3)',
        opacity: 1,
        filter: 'blur(0)',
        offset: 1,
      },
    ],
    {
      duration: 1500,
      fill: 'forwards',
    },
  ).finished;
};

export const animateSpin = (
  element: HTMLDivElement,
  lastDegree: number,
  targetDegree: number,
) => {
  return element.animate(
    [
      {
        rotate: `${lastDegree}deg`,
        offset: 0,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      {
        rotate: `${targetDegree}deg`,
        offset: 1,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    ],
    {
      duration: 10000,
      iterations: 1,
      fill: 'forwards',
    },
  ).finished;
};

export const animateShuffle = async (
  element: HTMLDivElement,
  callback: () => Promise<void>,
  lastSpinDegree: number = 0,
) => {
  const spin = element.animate(
    [
      {
        rotate: `${lastSpinDegree}deg`,
        opacity: 1,
        offset: 0,
        easing: 'linear',
      },
      {
        rotate: `${lastSpinDegree + 720}deg`,
        opacity: 0,
        offset: 1,
        easing: 'linear',
      },
    ],
    {
      duration: 2000,
      iterations: 1,
      fill: 'forwards',
    },
  );

  await spin.finished;

  await callback();

  return element.animate(
    [
      {
        rotate: '0deg',
        opacity: 0,
        offset: 0,
        easing: 'linear',
      },
      {
        rotate: `720deg`,
        opacity: 1,
        offset: 1,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    ],
    {
      duration: 3000,
      iterations: 1,
      fill: 'forwards',
    },
  ).finished;
};

export const reverseCardAnimation = (element: HTMLDivElement) => {
  return element.animate(
    [
      {
        transform: 'translateY(100px) scale(3)',
        opacity: 1,
        filter: 'blur(0)',
        offset: 0,
      },
      {
        transform: 'translateY(100px) scale(2)',
        opacity: 1,
        filter: 'blur(0)',
        offset: 0.01,
      },

      {
        transform: 'translateY(100px) scale(1.15)',
        opacity: 1,
        filter: 'blur(0)',
        offset: 0.25,
      },
      {
        transform: 'translateY(100px) scale(0.6)',
        opacity: 0.5,
        filter: 'blur(5px)',
        offset: 0.5,
      },
      {
        transform: 'translateY(50px) scale(0.6)',
        opacity: 0,
        offset: 0.75,
      },
      {
        transform: 'translateY(0px) scale(1)',
        opacity: 1,
        filter: 'blur(0px)',
        offset: 1,
      },
    ],
    {
      duration: 1500,
      fill: 'forwards',
    },
  ).finished;
};
