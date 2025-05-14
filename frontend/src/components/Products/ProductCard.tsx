import { Link } from 'react-router-dom'
import { Product } from '../../types'
import { useCart } from '../../context/CartContext'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Default values for the first variant
    const defaultColor = product.variants && product.variants.length > 0 ? product.variants[0].color : ''
    const defaultSize = product.variants && product.variants.length > 0 ? product.variants[0].size : ''
    
    addToCart({
      product_id: product.id,
      product_name: product.name,
      product_image: product.featured_image?.image || product.image,
      price: product.price,
      quantity: 1,
      color: defaultColor,
      size: defaultSize,
      slug: product.slug
    })
  }

  return (
    <div className="card group transition-all duration-300 hover:shadow-lg">
      <Link to={`/products/${product.slug}`} className="block relative overflow-hidden">
        <div className="aspect-w-1 aspect-h-1 h-64 w-full overflow-hidden bg-gray-200">
          {product.featured_image ? (
            <img
              src={product.featured_image.image}
              alt={product.featured_image.alt_text || product.name}
              className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
          ) : product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <i className="fas fa-tshirt text-4xl text-gray-400"></i>
            </div>
          )}
          
          {!product.in_stock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              Out of Stock
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
          <p className="text-gray-500 text-sm mb-2">{product.category?.name}</p>
          <div className="flex justify-between items-center">
            <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
            <button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className={`p-2 rounded-full ${
                product.in_stock
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <i className="fas fa-shopping-cart"></i>
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard
