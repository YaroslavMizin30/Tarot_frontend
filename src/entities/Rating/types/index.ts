export interface Rating {
  convenience: number;
  aesthetics: number;
  predictions: number;
  tarotSpreads: number;
  details: number;
  feedback?: string;
}

export type RatingPayload = Rating;
