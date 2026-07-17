export type Subsection =
  | '/natal-chart'
  | '/horoscopes'
  | '/calendar';

export interface SubsectionConfig {
  key: Subsection;
  label: string;
}

export const SUBSECTIONS: SubsectionConfig[] = [
  { key: '/horoscopes', label: 'Horoscopes' },
  { key: '/natal-chart', label: 'Natal chart' },
  { key: '/calendar', label: 'Moon calendar' },
];
