export type MoonPlanStatus = 'pending' | 'processing' | 'sent' | 'failed';

export interface MoonPlan {
  id: string;
  appUserId: string;
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
  appUserId: string;
  userId: number;
  planDate: string;
  text: string;
  locale: 'ru' | 'en';
  timezone: string;
  notificationTime: string;
}
