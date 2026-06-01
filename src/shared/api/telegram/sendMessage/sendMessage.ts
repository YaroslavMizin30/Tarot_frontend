import snakeize from 'snakeize';

import type { SendMessageParams } from './sendMessage.types';

const BOT_TOKEN = 'bot8259803505:AAHI2FjJzlXSJLtTdBhHXVbUT_xIy9zXnys';

export const sendMessage = async (params: SendMessageParams) => {
  const body = {
    chatId: window.Telegram?.WebApp?.initDataUnsafe?.chat?.id,
    ...params,
  };

  const response = await fetch(`https://api.telegram.org/${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(snakeize(body)),
  });

  return response.json();
};
