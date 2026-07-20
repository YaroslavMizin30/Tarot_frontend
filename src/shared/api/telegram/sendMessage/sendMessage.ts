import type {
  SendMessageParams,
  SendMessageResponse,
} from './sendMessage.types';
import { backend } from '@/shared/api/backend';

export const sendMessage = async (params: SendMessageParams) => {
  const response = await backend.invoke<SendMessageResponse>(
    'telegram-message',
    { text: params.text },
  );

  if (!response) {
    throw new Error('TELEGRAM_SEND_FAILED');
  }
  return response;
};
