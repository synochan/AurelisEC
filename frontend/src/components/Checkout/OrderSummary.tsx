import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

const OrderSummary = () => {
  const { cartItems, calculateCartTotal } = useCart()
  
  const subtotal = calculateCartTotal()
  const shipping = 10.00
  const tax = subtotal * 0.07
  const total = subtotal + shipping + tax

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
      
      {cartItems.length === 0 ? (
        <div className="py-4 text-center">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link to="/products" className="text-indigo-600 hover:text-indigo-800">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          {/* Order Items */}
          <div className="max-h-60 overflow-y-auto mb-4">
            {cartItems.map((item, index) => (
              <div key={`${item.product_id}-${item.color}-${item.size}`} className="flex py-2 border-b border-gray-200 last:border-b-0">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  {item.product_image ? (
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-100">
                      <i className="fas fa-tshirt text-gray-400"></i>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3 className="text-sm">{item.product_name}</h3>
                      <p className="ml-4 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {item.color && `${item.color}`} {item.size && `• ${item.size}`}
                    </p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-xs">
                    <p className="text-gray-500">Qty {item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Details */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Subtotal</p>
              <p className="text-sm font-medium">${subtotal.toFixed(2)}</p>
            </div>
            
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Shipping</p>
              <p className="text-sm font-medium">${shipping.toFixed(2)}</p>
            </div>
            
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Tax</p>
              <p className="text-sm font-medium">${tax.toFixed(2)}</p>
            </div>
          </div>
          
          {/* Total */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between">
              <p className="text-base font-medium text-gray-900">Total</p>
              <p className="text-base font-medium text-gray-900">${total.toFixed(2)}</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default OrderSummary
