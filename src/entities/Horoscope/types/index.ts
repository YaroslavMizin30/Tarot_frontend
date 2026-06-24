export interface Horoscope {
  userId: number;
  content: string;
  id: string;
  date: string;
  type: 'daily' | 'weekly' | 'monthly';
  isUserMessage?: boolean;
  sender?: string;
}
