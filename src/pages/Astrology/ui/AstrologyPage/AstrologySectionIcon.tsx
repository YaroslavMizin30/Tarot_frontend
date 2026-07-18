import type { SVGProps } from 'react';

type AstrologySectionIconName = 'horoscopes' | 'natal-chart' | 'calendar' | 'transits';

interface AstrologySectionIconProps extends SVGProps<SVGSVGElement> {
  name: AstrologySectionIconName;
}

export const AstrologySectionIcon = ({
  name,
  ...props
}: AstrologySectionIconProps) => (
  <svg
    aria-hidden={'true'}
    fill={'none'}
    stroke={'currentColor'}
    strokeLinecap={'round'}
    strokeLinejoin={'round'}
    strokeWidth={'1.6'}
    viewBox={'0 0 24 24'}
    {...props}
  >
    {name === 'horoscopes' ? (
      <>
        <circle cx={'12'} cy={'12'} r={'3.5'} />
        <path d={'M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1'} />
      </>
    ) : name === 'transits' ? (
      <>
        <circle cx={'7'} cy={'15'} r={'2.4'} />
        <circle cx={'16.5'} cy={'8'} r={'2.8'} />
        <path d={'M8.9 13.6 14.2 9.7M4.5 7.5h4M6.5 5.5v4M15.8 15.5h4'} />
      </>
    ) : name === 'natal-chart' ? (
      <>
        <circle cx={'12'} cy={'12'} r={'8.5'} />
        <circle cx={'12'} cy={'12'} r={'3'} />
        <path d={'M12 3.5v5.5M12 15v5.5M3.5 12H9M15 12h5.5M6 6l3.9 3.9M14.1 14.1 18 18M18 6l-3.9 3.9M9.9 14.1 6 18'} />
      </>
    ) : (
      <>
        <rect x={'4'} y={'5.5'} width={'16'} height={'14'} rx={'2'} />
        <path d={'M8 3.5v4M16 3.5v4M4 9.5h16'} />
        <path d={'M13.8 12.2a3 3 0 1 0 2.2 4.9 3.4 3.4 0 0 1-2.2-4.9Z'} />
      </>
    )}
  </svg>
);
