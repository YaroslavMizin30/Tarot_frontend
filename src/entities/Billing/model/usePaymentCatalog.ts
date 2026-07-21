import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/shared/api/queryKeys';

import { getPaymentCatalog } from '../api/payments';

export const usePaymentCatalog = () => {
  const query = useQuery({
    queryKey: queryKeys.billing.catalog,
    queryFn: getPaymentCatalog,
    staleTime: 5 * 60 * 1000,
  });

  return {
    products: query.data ?? [],
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
  };
};

