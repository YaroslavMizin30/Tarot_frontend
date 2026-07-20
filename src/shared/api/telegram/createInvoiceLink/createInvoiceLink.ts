import type {
  CreateInvoiceLinkParams,
  CreateInvoiceLinkResponse,
} from './createInvoiceLink.types';
import { backend } from '@/shared/api/backend';

export const createInvoiceLink = async (
  params: CreateInvoiceLinkParams,
): Promise<CreateInvoiceLinkResponse | null> => {
  const response = await backend.invoke<CreateInvoiceLinkResponse>(
    'create-invoice',
    { code: params.code, amount: params.amount },
  );

  if (response === null) {
    throw new Error('INVOICE_CREATION_FAILED');
  }

  return response;
};
