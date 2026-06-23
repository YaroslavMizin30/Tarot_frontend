export interface Rating {
  userId: number;
  convenience: number;
  aesthetics: number;
  predictions: number;
  tarotSpreads: number;
  details: number;
  feedback?: string;
}

export type RatingPayload = Omit<Rating, 'userId'>;
