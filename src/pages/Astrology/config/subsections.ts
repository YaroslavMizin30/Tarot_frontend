export type Subsection = '/natal-chart' | '/horoscopes';

export interface SubsectionConfig {
  key: Subsection;
  label: string;
}

export const SUBSECTIONS: SubsectionConfig[] = [
  { key: '/natal-chart', label: 'Natal chart' },
  { key: '/horoscopes', label: 'Horoscopes' },
];
