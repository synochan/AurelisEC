import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProduct } from '../../hooks/useQueries'
import Loader from '../UI/Loader'
import { useCart } from '../../context/CartContext'
import Alert from '../UI/Alert'

const ProductDetail = () => {
  const { slug = '' } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  
  const { data: product, isLoading, error: queryError } = useProduct(slug)
  
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)
  const [mainImage, setMainImage] = useState<string>('')
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [alertType, setAlertType] = useState<'success' | 'error'>('success')
  const [showAlert, setShowAlert] = useState(false)

  // Set initial values when product data loads
  useEffect(() => {
    if (product) {
      // Set default color and size from first variant
      if (product.variants && product.variants.length > 0) {
        setSelectedColor(product.variants[0].color)
        setSelectedSize(product.variants[0].size)
      }
      
      // Set main image from featured image or first image
      if (product.images && product.images.length > 0) {
        const featuredImage = product.images.find(img => img.is_featured)
        setMainImage(featuredImage ? featuredImage.image : product.images[0].image)
      } else if (product.image) {
        setMainImage(product.image)
      }
    }
  }, [product])

  const handleAddToCart = () => {
    if (!product) return
    
    // Check if product is in stock
    if (!product.in_stock) {
      setAlertType('error')
      setAlertMessage('Sorry, this product is out of stock')
      setShowAlert(true)
      return
    }
    
    // Check if color and size are selected
    if (product.variants && product.variants.length > 0) {
      if (!selectedColor || !selectedSize) {
        setAlertType('error')
        setAlertMessage('Please select color and size')
        setShowAlert(true)
        return
      }
      
      // Check if the selected variant has stock
      const selectedVariant = product.variants.find(
        v => v.color === selectedColor && v.size === selectedSize
      )
      
      if (!selectedVariant || selectedVariant.stock < quantity) {
        setAlertType('error')
        setAlertMessage('Selected variant is out of stock or has insufficient quantity')
        setShowAlert(true)
        return
      }
    }
    
    addToCart({
      product_id: product.id,
      product_name: product.name,
      product_image: mainImage || product.image,
      price: product.price,
      quantity,
      color: selectedColor,
      size: selectedSize,
      slug: product.slug
    })
    
    setAlertType('success')
    setAlertMessage('Product added to cart!')
    setShowAlert(true)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/cart')
  }

  const handleImageClick = (image: string) => {
    setMainImage(image)
  }

  if (isLoading) return <Loader />

  if (queryError || !product) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Failed to load product details</p>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {showAlert && (
        <Alert
          type={alertType}
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="mb-4 overflow-hidden rounded-lg">
            <div className="aspect-w-4 aspect-h-5 w-full">
              {mainImage ? (
                <img 
                  src={mainImage} 
                  alt={product.name} 
                  className="w-full h-full object-center object-cover" 
                />
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-gray-100">
                  <i className="fas fa-tshirt text-5xl text-gray-400"></i>
                </div>
              )}
            </div>
          </div>
          
          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageClick(image.image)}
                  className={`overflow-hidden rounded-md ${
                    mainImage === image.image ? 'ring-2 ring-indigo-600' : 'border border-gray-200'
                  }`}
                >
                  <img 
                    src={image.image} 
                    alt={image.alt_text || `Product view ${index + 1}`} 
                    className="w-full h-20 object-cover" 
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{product.name}</h1>
          
          <div className="mt-2">
            <p className="text-3xl text-gray-900">${product.price.toFixed(2)}</p>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center">
              <p className={`${product.in_stock ? 'text-green-600' : 'text-red-600'} font-medium`}>
                {product.in_stock ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="prose prose-sm text-gray-700">
              <p>{product.description}</p>
            </div>
          </div>
          
          {/* Color Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Color</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {Array.from(new Set(product.variants.map(v => v.color))).map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 border rounded-md ${
                      selectedColor === color
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Size Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900">Size</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {Array.from(new Set(product.variants.map(v => v.size))).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 border rounded-md ${
                      selectedSize === size
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity Selector */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
            <div className="mt-2 flex items-center">
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="p-2 border border-gray-300 rounded-l-md"
              >
                <i className="fas fa-minus text-gray-600"></i>
              </button>
              <div className="flex-1 px-4 py-2 text-center border-y border-gray-300">
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(prev => prev + 1)}
                className="p-2 border border-gray-300 rounded-r-md"
              >
                <i className="fas fa-plus text-gray-600"></i>
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className={`flex-1 flex items-center justify-center px-8 py-3 rounded-md text-base font-medium ${
                product.in_stock
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <i className="fas fa-shopping-cart mr-2"></i>
              Add to Cart
            </button>
            
            <button
              onClick={handleBuyNow}
              disabled={!product.in_stock}
              className={`flex-1 flex items-center justify-center px-8 py-3 rounded-md text-base font-medium ${
                product.in_stock
                  ? 'bg-indigo-800 text-white hover:bg-indigo-900'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Buy Now
            </button>
          </div>
          
          {/* Category */}
          <div className="mt-8 text-sm">
            <span className="text-gray-600">Category: </span>
            <span className="font-medium">{product.category?.name}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
