export interface Rating {
  appUserId?: string;
  userId: number;
  convenience: number;
  aesthetics: number;
  predictions: number;
  tarotSpreads: number;
  details: number;
  feedback?: string;
}

export type RatingPayload = Omit<Rating, 'userId' | 'appUserId'>;
