import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../../hooks/useQueries'
import { Product } from '../../types'
import ProductCard from './ProductCard'
import Loader from '../UI/Loader'

interface ProductListProps {
  category?: string
}

const ProductList = ({ category }: ProductListProps) => {
  const [searchParams] = useSearchParams()
  
  // Build query params for filtering
  const params = new URLSearchParams()
  
  if (category) {
    params.append('category', category)
  }
  
  // Get search params from URL
  const categoryParam = searchParams.get('category')
  const searchQuery = searchParams.get('search')
  const priceMin = searchParams.get('price_min')
  const priceMax = searchParams.get('price_max')
  const inStock = searchParams.get('in_stock')
  const sortBy = searchParams.get('sort_by')
  
  if (categoryParam) {
    params.append('category', categoryParam)
  }
  if (searchQuery) {
    params.append('search', searchQuery)
  }
  if (priceMin) {
    params.append('price_min', priceMin)
  }
  if (priceMax) {
    params.append('price_max', priceMax)
  }
  if (inStock) {
    params.append('in_stock', inStock)
  }
  if (sortBy) {
    params.append('sort_by', sortBy)
  }
  
  // Use TanStack Query to fetch products
  const { data: products, isLoading, error } = useProducts(params)

  if (isLoading) return <Loader />

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Failed to load products</p>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10">
        <p>No products found. Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductList
