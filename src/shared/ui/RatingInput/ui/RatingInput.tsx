import { useState } from 'react';

import { type RatingInputProps } from './RatingInput.props';

import styles from './RatingInput.module.css';

export const RatingInput = ({
  value,
  onChange,
  size = 'md',
  disabled = false,
}: RatingInputProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  const starSize = {
    sm: styles.s,
    md: styles.m,
    lg: styles.l,
  }[size];

  const handleClick = (star: number) => {
    if (!disabled) {
      onChange(star);
    }
  };

  const handleMouseEnter = (star: number) => {
    if (!disabled) {
      setHoverRating(star);
    }
  };

  return (
    <div className={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={'button'}
          className={`${starSize} ${styles.button} ${disabled ? styles.disabled : ''}`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={() => setHoverRating(0)}
          disabled={disabled}
          aria-label={`Оценка ${star} из 5`}
        >
          <svg
            xmlns={'http://www.w3.org/2000/svg'}
            viewBox={'0 0 24 24'}
            fill={star <= (hoverRating || value) ? '#fad780' : 'none'}
            stroke={star <= (hoverRating || value) ? '#fad780' : '#fad780'}
            strokeWidth={star <= (hoverRating || value) ? '1' : '0.5'}
            className={styles.star}
          >
            <path
              fillRule={'evenodd'}
              d={
                'M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.273 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.233-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
              }
              clipRule={'evenodd'}
            />
          </svg>
        </button>
      ))}

      <input
        type={'range'}
        min={'1'}
        max={'5'}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        // className="sr-only"
        disabled={disabled}
        style={{ display: 'none' }}
      />
    </div>
  );
};
