import type {
  SendMessageParams,
  SendMessageResponse,
} from './sendMessage.types';

export const sendMessage = async (params: SendMessageParams) => {
  const { data: response, error } =
    await window.supabase.functions.invoke<SendMessageResponse>(
      'telegram-message',
      { body: { text: params.text } },
    );

  if (error || !response) {
    throw error ?? new Error('TELEGRAM_SEND_FAILED');
  }
  return response;
};
