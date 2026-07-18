export type MoonPlanStatus = 'pending' | 'processing' | 'sent' | 'failed';

export interface MoonPlan {
  id: string;
  userId: number;
  planDate: string;
  text: string;
  locale: 'ru' | 'en';
  timezone: string;
  notificationTime: string;
  notifyAt: string;
  status: MoonPlanStatus;
  attempts: number;
  createdAt: string;
}

export interface CreateMoonPlanPayload {
  userId: number;
  planDate: string;
  text: string;
  locale: 'ru' | 'en';
  timezone: string;
  notificationTime: string;
}
