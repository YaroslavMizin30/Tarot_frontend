export type Subsection = 'natal-chart' | null;

export interface SubsectionConfig {
  key: Subsection;
  label: string;
}

export const SUBSECTIONS: SubsectionConfig[] = [
  { key: 'natal-chart', label: 'Natal chart' },
];
