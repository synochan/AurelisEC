import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Product } from '../../types'
import { fetchProducts } from '../../utils/api'
import ProductCard from './ProductCard'
import Loader from '../UI/Loader'

interface ProductListProps {
  category?: string
}

const ProductList = ({ category }: ProductListProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        
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
        
        const data = await fetchProducts(params)
        setProducts(data)
        setError(null)
      } catch (err) {
        setError('Failed to load products')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [category, searchParams])

  if (loading) return <Loader />

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <p>No products found. Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductList
