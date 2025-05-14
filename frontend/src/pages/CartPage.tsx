import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CartItem from '../components/Cart/CartItem'
import CartSummary from '../components/Cart/CartSummary'

const CartPage = () => {
  const { cartItems } = useCart()
  
  // Update page title
  useEffect(() => {
    document.title = 'Shopping Cart | FashionTrend'
    
    return () => {
      document.title = 'FashionTrend | Modern Apparel Store'
    }
  }, [])

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="mb-4 text-indigo-500">
            <i className="fas fa-shopping-cart text-5xl"></i>
          </div>
          <h2 className="text-2xl font-medium text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link
            to="/products"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:flex-grow">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                {cartItems.map((item) => (
                  <CartItem 
                    key={`${item.product_id}-${item.color}-${item.size}`}
                    item={item}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Cart Summary */}
          <div className="lg:w-80">
            <CartSummary />
          </div>
        </div>
      )}
      
      {/* Related Products Section */}
      {cartItems.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* This would ideally be populated with actual related products from an API */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-md mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage
