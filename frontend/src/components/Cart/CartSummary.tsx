import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

interface CartSummaryProps {
  isCheckout?: boolean
}

const CartSummary = ({ isCheckout = false }: CartSummaryProps) => {
  const { cartItems, calculateCartTotal } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [promoCode, setPromoCode] = useState('')
  const [promoError, setPromoError] = useState<string | null>(null)

  const subtotal = calculateCartTotal()
  const shipping = 10.00  // Fixed shipping cost for now
  const tax = subtotal * 0.07  // 7% tax
  const total = subtotal + shipping + tax

  const handleApplyPromoCode = () => {
    // For simplicity, we're not implementing actual promo code logic
    if (promoCode.trim()) {
      setPromoError('Invalid or expired promo code')
    } else {
      setPromoError(null)
    }
  }

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout')
    } else {
      navigate('/login?redirect=checkout')
    }
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
      
      {/* Order Details */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <p className="text-sm text-gray-600">Subtotal ({cartItems.length} items)</p>
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
        
        {!isCheckout && (
          <div className="pt-2">
            <div className="flex">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo code"
                className="form-input flex-1 text-sm py-2"
              />
              <button
                onClick={handleApplyPromoCode}
                className="ml-2 whitespace-nowrap bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded text-sm transition-colors duration-200"
              >
                Apply
              </button>
            </div>
            {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
          </div>
        )}
      </div>
      
      {/* Total */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between">
          <p className="text-base font-medium text-gray-900">Total</p>
          <p className="text-base font-medium text-gray-900">${total.toFixed(2)}</p>
        </div>
      </div>
      
      {/* Action Button */}
      {!isCheckout && (
        <button
          onClick={handleCheckout}
          disabled={cartItems.length === 0}
          className={`w-full py-3 px-4 rounded-md shadow-sm font-medium text-white ${
            cartItems.length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
        </button>
      )}
    </div>
  )
}

export default CartSummary
