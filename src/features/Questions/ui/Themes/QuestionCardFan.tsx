import type { SVGProps } from 'react';

export const QuestionCardFan = (props: SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden={'true'}
    fill={'none'}
    viewBox={'0 0 96 72'}
    xmlns={'http://www.w3.org/2000/svg'}
    {...props}
  >
    <g opacity={'0.42'} transform={'rotate(-15 30 44)'}>
      <rect
        x={'13'}
        y={'12'}
        width={'34'}
        height={'54'}
        rx={'3'}
      />
      <rect
        x={'16'}
        y={'15'}
        width={'28'}
        height={'48'}
        rx={'2'}
        fill={'currentColor'}
        fillOpacity={'0.9'}
      />
      <path
        d={'M30 27a7 7 0 1 0 5 12 8 8 0 1 1-5-12Z'}
        fill={'var(--text-on-control)'}
        fillOpacity={'0.86'}
        stroke={'var(--text-on-control)'}
      />
      <path
        d={'m30 49 3.5 4.5L30 58l-3.5-4.5L30 49Z'}
        fill={'var(--text-on-control)'}
        fillOpacity={'0.86'}
        stroke={'var(--text-on-control)'}
      />
    </g>

    <g opacity={'0.68'} transform={'rotate(-2 50 40)'}>
      <rect
        x={'33'}
        y={'7'}
        width={'34'}
        height={'56'}
        rx={'3'}
      />
      <rect
        x={'36'}
        y={'10'}
        width={'28'}
        height={'50'}
        rx={'2'}
        fill={'currentColor'}
        fillOpacity={'0.9'}
      />
      <path
        d={'M50 24a7 7 0 1 0 5 12 8 8 0 1 1-5-12Z'}
        fill={'var(--text-on-control)'}
        fillOpacity={'0.86'}
        stroke={'var(--text-on-control)'}
      />
      <path
        d={'m50 46 3.5 4.5L50 55l-3.5-4.5L50 46Z'}
        fill={'var(--text-on-control)'}
        fillOpacity={'0.86'}
        stroke={'var(--text-on-control)'}
      />
    </g>

    <g transform={'rotate(12 69 42)'}>
      <rect
        x={'52'}
        y={'11'}
        width={'34'}
        height={'56'}
        rx={'3'}
      />
      <rect
        x={'55'}
        y={'14'}
        width={'28'}
        height={'50'}
        rx={'2'}
        fill={'currentColor'}
        fillOpacity={'0.9'}
      />
      <path
        d={'M70 27a7 7 0 1 0 5 12 8 8 0 1 1-5-12Z'}
        fill={'var(--text-on-control)'}
        fillOpacity={'0.86'}
        stroke={'var(--text-on-control)'}
      />
      <path
        d={'m70 49 3.5 4.5L70 58l-3.5-4.5L70 49Z'}
        fill={'var(--text-on-control)'}
        fillOpacity={'0.86'}
        stroke={'var(--text-on-control)'}
      />
    </g>
  </svg>
);
