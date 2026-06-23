import http from '../../http/http';

import type {
  SendMessageParams,
  SendMessageResponse,
} from './sendMessage.types';

import getTelegramUser from '@/entities/TelegramUser';

export const sendMessage = async (params: SendMessageParams) => {
  const body = {
    chatId: getTelegramUser()?.id,
    ...params,
  };

  const response = await http<SendMessageResponse>(
    `https://api.telegram.org/${import.meta.env.VITE_TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    },
  );

  return response;
};
