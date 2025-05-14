import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CheckoutForm, { CheckoutFormData } from '../components/Checkout/CheckoutForm'
import PaymentForm from '../components/Checkout/PaymentForm'
import OrderSummary from '../components/Checkout/OrderSummary'
import Alert from '../components/UI/Alert'

const CheckoutPage = () => {
  const { cartItems } = useCart()
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping')
  const [shippingDetails, setShippingDetails] = useState<CheckoutFormData | null>(null)
  
  // Update page title
  useEffect(() => {
    document.title = 'Checkout | FashionTrend'
    
    return () => {
      document.title = 'FashionTrend | Modern Apparel Store'
    }
  }, [])
  
  // Redirect if cart is empty or user is not authenticated
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login?redirect=checkout')
      } else if (cartItems.length === 0) {
        navigate('/cart')
      }
    }
  }, [isAuthenticated, isLoading, cartItems.length, navigate])
  
  const handleShippingSubmit = (data: CheckoutFormData) => {
    setShippingDetails(data)
    setStep('payment')
    window.scrollTo(0, 0)
  }
  
  const handleBackToShipping = () => {
    setStep('shipping')
    window.scrollTo(0, 0)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <Alert
          type="error"
          message="Please sign in to continue with checkout"
        />
      </div>
    )
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Alert
          type="info"
          message="Your cart is empty. Please add items before proceeding to checkout."
        />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      {/* Checkout Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className={`flex items-center ${step === 'shipping' ? 'text-indigo-600' : 'text-gray-500'}`}>
            <span className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
              step === 'shipping' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}>
              1
            </span>
            <span className="font-medium">Shipping</span>
          </div>
          
          <div className="w-16 h-1 mx-4 bg-gray-200">
            {step === 'payment' && (
              <div className="h-full bg-indigo-600 transition-all duration-500"></div>
            )}
          </div>
          
          <div className={`flex items-center ${step === 'payment' ? 'text-indigo-600' : 'text-gray-500'}`}>
            <span className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
              step === 'payment' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}>
              2
            </span>
            <span className="font-medium">Payment</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:flex-grow">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              {step === 'shipping' && (
                <CheckoutForm onSubmit={handleShippingSubmit} />
              )}
              
              {step === 'payment' && shippingDetails && (
                <PaymentForm
                  shippingDetails={shippingDetails}
                  onBack={handleBackToShipping}
                />
              )}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-80">
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
