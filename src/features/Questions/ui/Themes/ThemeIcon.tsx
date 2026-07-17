import type { ReactNode, SVGProps } from 'react';

export type ThemeIconName =
  | 'anxiety'
  | 'decision'
  | 'love'
  | 'career'
  | 'money'
  | 'self'
  | 'emotion'
  | 'spirituality'
  | 'transformation'
  | 'balance';

interface ThemeIconProps extends SVGProps<SVGSVGElement> {
  name: ThemeIconName;
}

const paths: Record<ThemeIconName, ReactNode> = {
  anxiety: (
    <>
      <path d={"M6.5 17.5h10a3.5 3.5 0 0 0 .4-7 5 5 0 0 0-9.6-1.4A4.3 4.3 0 0 0 6.5 17.5Z"} />
      <path d={"M8 20h.01M12 20h.01M16 20h.01"} />
    </>
  ),
  decision: (
    <>
      <circle cx={"12"} cy={"12"} r={"8"} />
      <path d={"m14.8 9.2-1.7 3.9-3.9 1.7 1.7-3.9 3.9-1.7Z"} />
    </>
  ),
  love: <path d={"M20 8.7c0 5-8 10-8 10s-8-5-8-10A4.2 4.2 0 0 1 12 6a4.2 4.2 0 0 1 8 2.7Z"} />,
  career: (
    <>
      <rect x={"3.5"} y={"7"} width={"17"} height={"12"} rx={"2"} />
      <path d={"M9 7V5h6v2M3.5 12h17M10 12v2h4v-2"} />
    </>
  ),
  money: (
    <>
      <ellipse cx={"12"} cy={"7"} rx={"7"} ry={"3"} />
      <path d={"M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"} />
    </>
  ),
  self: (
    <>
      <path d={"M3.5 12s3.2-5 8.5-5 8.5 5 8.5 5-3.2 5-8.5 5-8.5-5-8.5-5Z"} />
      <circle cx={"12"} cy={"12"} r={"2.5"} />
    </>
  ),
  emotion: <path d={"M3 9c3-3 5 3 8 0s5 3 8 0M3 14c3-3 5 3 8 0s5 3 8 0M5 19c2-2 4 2 6 0s4 2 6 0"} />,
  spirituality: (
    <>
      <path d={"M15.8 4.8A7.5 7.5 0 1 0 19 17a7.6 7.6 0 0 1-3.2-12.2Z"} />
      <path d={"M18.5 4v3M17 5.5h3"} />
    </>
  ),
  transformation: (
    <>
      <path d={"M12 12C9 7 5 6 4 8c-1 2 2 5 8 4ZM12 12c3-5 7-6 8-4 1 2-2 5-8 4ZM12 12c-3 1-5 4-3 6 1.5 1.5 3-1 3-6ZM12 12c3 1 5 4 3 6-1.5 1.5-3-1-3-6Z"} />
      <path d={"M12 6v12"} />
    </>
  ),
  balance: (
    <>
      <path d={"M12 4v16M7 20h10M5 7h14"} />
      <path d={"m7 7-3 6h6L7 7ZM17 7l-3 6h6l-3-6Z"} />
    </>
  ),
};

export const ThemeIcon = ({ name, ...props }: ThemeIconProps) => (
  <svg
    aria-hidden={true}
    fill={"none"}
    stroke={"currentColor"}
    strokeLinecap={"round"}
    strokeLinejoin={"round"}
    strokeWidth={"1.7"}
    viewBox={"0 0 24 24"}
    {...props}
  >
    {paths[name]}
  </svg>
);
