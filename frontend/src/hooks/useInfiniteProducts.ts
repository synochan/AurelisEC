import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Product } from '../types';
import { QUERY_KEYS } from './useQueries';

interface ProductsResponse {
  results: Product[];
  next: string | null;
  previous: string | null;
  count: number;
}

// Default function for fetching paginated products
export const fetchPaginatedProducts = async ({ pageParam = 1, filters = {} }) => {
  const queryParams = new URLSearchParams();
  
  // Add page parameter
  queryParams.append('page', pageParam.toString());
  
  // Add any other filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, value.toString());
    }
  });
  
  const response = await axios.get<ProductsResponse>(
    `http://localhost:8000/api/products/?${queryParams.toString()}`
  );
  
  return {
    results: response.data.results,
    nextPage: response.data.next ? pageParam + 1 : null,
    totalCount: response.data.count,
  };
};

// Hook for infinite scrolling product list
export const useInfiniteProducts = (filters: Record<string, string | number> = {}) => {
  return useInfiniteQuery(
    [QUERY_KEYS.PRODUCTS, filters],
    ({ pageParam = 1 }) => fetchPaginatedProducts({ pageParam, filters }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 15, // 15 minutes
      refetchOnWindowFocus: false,
      retry: 2,
      onError: (error) => {
        console.error('Error fetching products with infinite scroll:', error);
      }
    }
  );
};

// Utility function to flatten the results from useInfiniteQuery
export const extractProductsFromInfiniteQuery = (
  data: { pages: { results: Product[] }[] } | undefined
): Product[] => {
  if (!data) return [];
  
  return data.pages.reduce<Product[]>((acc, page) => {
    return [...acc, ...page.results];
  }, []);
};