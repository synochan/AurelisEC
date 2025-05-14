import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Product } from '../../types'
import { fetchFeaturedProducts } from '../../utils/api'
import ProductCard from '../Products/ProductCard'
import Loader from '../UI/Loader'

const Featured = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true)
        const data = await fetchFeaturedProducts()
        setProducts(data)
        setError(null)
      } catch (err) {
        setError('Failed to load featured products')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedProducts()
  }, [])

  if (loading) return <Loader />

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Featured Products</h2>
        <p className="mt-2 text-gray-600">Check out our latest additions to the collection</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-10">
          <p>No featured products available at this time.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
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
