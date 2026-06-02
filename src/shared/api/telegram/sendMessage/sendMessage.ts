import snakeize from 'snakeize';

import type {
  SendMessageParams,
  SendMessageResponse,
} from './sendMessage.types';

import getTelegramUser from '@/entities/TelegramUser';

const BOT_TOKEN = 'bot8773471919:AAETj1EuJOAJuqFdZ5nptAPHcS6EY10lY_s';

export const sendMessage = async (params: SendMessageParams) => {
  const body = {
    chatId: getTelegramUser()?.id,
    ...params,
  };

  const response = await fetch(
    `https://api.telegram.org/${BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(snakeize(body)),
    },
  );

  return response.json() as Promise<SendMessageResponse>;
};
