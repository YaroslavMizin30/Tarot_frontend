import type {
  CreateInvoiceLinkParams,
  CreateInvoiceLinkResponse,
} from './createInvoiceLink.types';

import getTelegramUser from '@/entities/TelegramUser';

export const createInvoiceLink = async (
  params: CreateInvoiceLinkParams,
): Promise<CreateInvoiceLinkResponse | null> => {
  const telegramUser = getTelegramUser();
  const userId = telegramUser?.id;

  if (!userId) {
    throw new Error('Telegram user is not defined');
  }

  const { data: response } =
    await window.supabase.functions.invoke<CreateInvoiceLinkResponse>(
      'create-invoice',
      {
        body: {
          userId,
          code: params.code,
          amount: params.amount,
          price: params.price,
          payload: params.payload,
          title: params.title,
          description: params.description,
        },
      },
    );

  if (response === null) {
    return null;
  }

  return response;
};
