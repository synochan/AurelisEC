import { useEffect } from 'react'
import ProductDetail from '../components/Products/ProductDetail'
import { useParams } from 'react-router-dom'

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>()
  
  // Update page title based on product
  useEffect(() => {
    document.title = slug 
      ? `${slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} | FashionTrend` 
      : 'Product Details | FashionTrend'
    
    return () => {
      document.title = 'FashionTrend | Modern Apparel Store'
    }
  }, [slug])

  return (
    <div>
      <ProductDetail />
    </div>
  )
}

export default ProductDetailPage
