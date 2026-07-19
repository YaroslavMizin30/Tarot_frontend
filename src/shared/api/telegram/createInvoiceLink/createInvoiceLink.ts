import type {
  CreateInvoiceLinkParams,
  CreateInvoiceLinkResponse,
} from './createInvoiceLink.types';

export const createInvoiceLink = async (
  params: CreateInvoiceLinkParams,
): Promise<CreateInvoiceLinkResponse | null> => {
  const { data: response, error } =
    await window.supabase.functions.invoke<CreateInvoiceLinkResponse>(
      'create-invoice',
      {
        body: {
          code: params.code,
          amount: params.amount,
        },
      },
    );

  if (error || response === null) {
    throw error ?? new Error('INVOICE_CREATION_FAILED');
  }

  return response;
};
