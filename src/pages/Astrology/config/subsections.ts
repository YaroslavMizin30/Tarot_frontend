export type Subsection =
  | '/natal-chart'
  | '/horoscopes'
  | '/calendar'
  | '/transits';

export interface SubsectionConfig {
  key: Subsection;
  label: string;
}

export const SUBSECTIONS: SubsectionConfig[] = [
  { key: '/transits', label: 'Personal transits' },
  { key: '/calendar', label: 'Moon calendar' },
  { key: '/horoscopes', label: 'Horoscopes' },
  { key: '/natal-chart', label: 'Natal chart' },
];
