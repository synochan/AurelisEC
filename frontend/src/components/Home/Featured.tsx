import { Link } from 'react-router-dom'
import { Product } from '../../types'
import ProductCard from '../Products/ProductCard'
import Loader from '../UI/Loader'
import { useFeaturedProducts } from '../../hooks/useQueries'

const Featured = () => {
  // Using TanStack Query hook to fetch featured products
  const { data: products, isLoading, error } = useFeaturedProducts()

  if (isLoading) return <Loader />

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Failed to load featured products</p>
      </div>
    )
  }

  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Featured Products</h2>
        <p className="mt-2 text-gray-600">Check out our latest additions to the collection</p>
        <div className="mt-2">
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            Using TanStack Query for optimized data fetching and caching
          </span>
        </div>
      </div>

      {!products || products.length === 0 ? (
        <div className="text-center py-10">
          <p>No featured products available at this time.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View All Products
              <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </>
      )}
    </section>
  )
}

export default Featured
