import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from '../../types';
import ProductCard from './ProductCard';
import Loader from '../UI/Loader';
import { useInfiniteProducts, extractProductsFromInfiniteQuery } from '../../hooks/useInfiniteProducts';

interface ProductListInfiniteProps {
  category?: string;
}

const ProductListInfinite: React.FC<ProductListInfiniteProps> = ({ category }) => {
  const [searchParams] = useSearchParams();
  const loaderRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  
  // Update filters based on searchParams and category
  useEffect(() => {
    const newFilters: Record<string, string> = {};
    
    if (category) {
      newFilters.category = category;
    }
    
    // Add all search params to filters
    const categoryParam = searchParams.get('category');
    const searchQuery = searchParams.get('search');
    const priceMin = searchParams.get('price_min');
    const priceMax = searchParams.get('price_max');
    const inStock = searchParams.get('in_stock');
    const sortBy = searchParams.get('sort_by');
    
    if (categoryParam) newFilters.category = categoryParam;
    if (searchQuery) newFilters.search = searchQuery;
    if (priceMin) newFilters.price_min = priceMin;
    if (priceMax) newFilters.price_max = priceMax;
    if (inStock) newFilters.in_stock = inStock;
    if (sortBy) newFilters.sort_by = sortBy;
    
    setFilters(newFilters);
  }, [category, searchParams]);
  
  // Use TanStack Query's infinite query hook
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteProducts(filters);
  
  // Extract flat array of products from infinite query data
  const products = extractProductsFromInfiniteQuery(data);
  
  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, options);
    
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  
  if (isLoading && !isFetchingNextPage) return <Loader />;
  
  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Failed to load products. Please try again later.</p>
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <p>No products found. Try adjusting your filters.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* Loader for infinite scrolling */}
      <div ref={loaderRef} className="py-4 text-center">
        {isFetchingNextPage ? (
          <div className="flex justify-center py-4">
            <Loader />
          </div>
        ) : hasNextPage ? (
          <p className="text-gray-500">Scroll to load more products</p>
        ) : (
          <p className="text-gray-500">No more products to load</p>
        )}
      </div>
      
      {/* Badge showing we're using TanStack Query */}
      <div className="text-center mt-2 mb-6">
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          Using TanStack Query with Infinite Scroll
        </span>
      </div>
    </div>
  );
};

export default ProductListInfinite;