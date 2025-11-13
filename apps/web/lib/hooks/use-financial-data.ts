/**
 * Custom hooks for financial data with SWR caching
 */
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useFinancialSummary() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/dashboard/summary',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000,
    }
  );

  return {
    summary: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useTransactions(limit = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/transactions?limit=${limit}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000,
    }
  );

  return {
    transactions: data?.transactions || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useAccounts() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/open-finance/accounts',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000,
    }
  );

  return {
    accounts: data?.accounts || [],
    isLoading,
    isError: error,
    mutate,
  };
}
