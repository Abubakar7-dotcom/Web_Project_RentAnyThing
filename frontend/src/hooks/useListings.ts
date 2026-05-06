import { useState, useEffect, useCallback } from 'react';
import { getListings, type Listing, type GetListingsParams } from '../services/listingService';

interface UseListingsReturn {
  listings: Listing[];
  isLoading: boolean;
  error: string | null;
  search: string;
  setSearch: (search: string) => void;
  refetch: () => Promise<void>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
}

export function useListings(initialParams: GetListingsParams = {}): UseListingsReturn {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearchState] = useState(initialParams.search || '');
  const [pagination, setPagination] = useState<UseListingsReturn['pagination']>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchListings = useCallback(async (params: GetListingsParams = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const finalParams = {
        ...initialParams,
        ...params,
        search: debouncedSearch || params.search,
      };

      const result = await getListings(finalParams);
      setListings(result.listings);
      setPagination(result.pagination);
    } catch (err: any) {
      console.error('Error fetching listings:', err);
      setError(err.response?.data?.error || 'Failed to fetch listings');
      setListings([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, initialParams]);

  // Fetch listings when debounced search changes
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const setSearch = useCallback((newSearch: string) => {
    setSearchState(newSearch);
  }, []);

  const refetch = useCallback(() => {
    return fetchListings();
  }, [fetchListings]);

  return {
    listings,
    isLoading,
    error,
    search,
    setSearch,
    refetch,
    pagination,
  };
}