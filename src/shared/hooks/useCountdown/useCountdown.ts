import { useEffect, useState } from 'react';

export interface CountdownTime {
  hours: string;
  minutes: string;
  seconds: string;
  totalMs: number;
  isFinished: boolean;
}

const pad = (n: number): string => n.toString().padStart(2, '0');

export const useCountdown = (targetDate: Date | string | null): CountdownTime => {
  const computeRemaining = (): CountdownTime => {
    if (!targetDate) {
      return { hours: '00', minutes: '00', seconds: '00', totalMs: 0, isFinished: true };
    }

    const diff = new Date(targetDate).getTime() - Date.now();

    if (diff <= 0) {
      return { hours: '00', minutes: '00', seconds: '00', totalMs: 0, isFinished: true };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds),
      totalMs: diff,
      isFinished: false,
    };
  };

  const [time, setTime] = useState<CountdownTime>(computeRemaining);

  useEffect(() => {
    setTime(computeRemaining());

    if (!targetDate) {
      return;
    }

    const interval = setInterval(() => {
      const next = computeRemaining();
      setTime(next);

      if (next.isFinished) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate ? new Date(targetDate).getTime() : null]);

  return time;
};
