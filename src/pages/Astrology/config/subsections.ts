export type Subsection =
  | '/natal-chart'
  | '/horoscopes'
  | '/forecast'
  | '/calendar';

export interface SubsectionConfig {
  key: Subsection;
  label: string;
}

export const SUBSECTIONS: SubsectionConfig[] = [
  { key: '/horoscopes', label: 'Horoscopes' },
  { key: '/natal-chart', label: 'Natal chart' },
  { key: '/forecast', label: 'Common forecast' },
  { key: '/calendar', label: 'Moon calendar' },
];
