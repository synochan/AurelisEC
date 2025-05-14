import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { CheckoutFormData } from './CheckoutForm'
import { useCart } from '../../context/CartContext'
import { createOrder } from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import Alert from '../UI/Alert'

interface PaymentFormProps {
  shippingDetails: CheckoutFormData
  onBack: () => void
}

type PaymentFormData = {
  cardNumber: string
  cardName: string
  expiryDate: string
  cvv: string
  paymentMethod: 'credit_card' | 'paypal' | 'stripe'
}

const PaymentForm = ({ shippingDetails, onBack }: PaymentFormProps) => {
  const { cartItems, calculateCartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAlert, setShowAlert] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<PaymentFormData>({
    defaultValues: {
      paymentMethod: 'credit_card'
    }
  })

  const paymentMethod = watch('paymentMethod')

  const onSubmit: SubmitHandler<PaymentFormData> = async (data) => {
    if (cartItems.length === 0) {
      setError('Your cart is empty')
      setShowAlert(true)
      return
    }

    try {
      setIsProcessing(true)
      setError(null)

      // Prepare order items from cart
      const orderItems = cartItems.map(item => ({
        product: item.product_id,
        quantity: item.quantity,
        color: item.color,
        size: item.size
      }))

      // Prepare order data
      const orderData = {
        first_name: shippingDetails.firstName,
        last_name: shippingDetails.lastName,
        email: shippingDetails.email,
        address: shippingDetails.address,
        city: shippingDetails.city,
        state: shippingDetails.state,
        postal_code: shippingDetails.postalCode,
        country: shippingDetails.country,
        phone: shippingDetails.phone,
        items: orderItems,
        payment_method: data.paymentMethod
      }

      // Create order
      const response = await createOrder(orderData)
      
      // Clear cart after successful order
      clearCart()
      
      // Redirect to order confirmation
      navigate('/profile', { 
        state: { 
          orderSuccess: true,
          orderId: response.id
        } 
      })
    } catch (err) {
      console.error('Payment error:', err)
      setError('There was a problem processing your payment. Please try again.')
      setShowAlert(true)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="mt-6">
      {showAlert && error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setShowAlert(false)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-xl font-medium text-gray-900">Payment Method</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center">
              <input
                id="credit-card"
                type="radio"
                value="credit_card"
                {...register('paymentMethod')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700">
                Credit Card <i className="fas fa-credit-card ml-1"></i>
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="paypal"
                type="radio"
                value="paypal"
                {...register('paymentMethod')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
                PayPal <i className="fab fa-paypal ml-1"></i>
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="stripe"
                type="radio"
                value="stripe"
                {...register('paymentMethod')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label htmlFor="stripe" className="ml-3 block text-sm font-medium text-gray-700">
                Stripe <i className="fab fa-stripe ml-1"></i>
              </label>
            </div>
          </div>
        </div>

        {paymentMethod === 'credit_card' && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">Card Details</h3>
            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div className="sm:col-span-2">
                <label htmlFor="cardName" className="form-label">
                  Name on card
                </label>
                <input
                  id="cardName"
                  type="text"
                  {...register('cardName', { required: 'Card name is required' })}
                  className={`form-input ${errors.cardName ? 'border-red-500' : ''}`}
                  placeholder="John Doe"
                />
                {errors.cardName && <p className="mt-1 text-red-500 text-sm">{errors.cardName.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="cardNumber" className="form-label">
                  Card number
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  {...register('cardNumber', { 
                    required: 'Card number is required',
                    pattern: {
                      value: /^[0-9]{16}$/,
                      message: 'Please enter a valid 16-digit card number'
                    }
                  })}
                  className={`form-input ${errors.cardNumber ? 'border-red-500' : ''}`}
                  placeholder="XXXX XXXX XXXX XXXX"
                />
                {errors.cardNumber && <p className="mt-1 text-red-500 text-sm">{errors.cardNumber.message}</p>}
              </div>

              <div>
                <label htmlFor="expiryDate" className="form-label">
                  Expiry date (MM/YY)
                </label>
                <input
                  id="expiryDate"
                  type="text"
                  {...register('expiryDate', { 
                    required: 'Expiry date is required',
                    pattern: {
                      value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                      message: 'Please enter a valid expiry date (MM/YY)'
                    }
                  })}
                  className={`form-input ${errors.expiryDate ? 'border-red-500' : ''}`}
                  placeholder="MM/YY"
                />
                {errors.expiryDate && <p className="mt-1 text-red-500 text-sm">{errors.expiryDate.message}</p>}
              </div>

              <div>
                <label htmlFor="cvv" className="form-label">
                  CVV
                </label>
                <input
                  id="cvv"
                  type="text"
                  {...register('cvv', { 
                    required: 'CVV is required',
                    pattern: {
                      value: /^[0-9]{3,4}$/,
                      message: 'Please enter a valid CVV'
                    }
                  })}
                  className={`form-input ${errors.cvv ? 'border-red-500' : ''}`}
                  placeholder="XXX"
                />
                {errors.cvv && <p className="mt-1 text-red-500 text-sm">{errors.cvv.message}</p>}
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'paypal' && (
          <div className="border-t border-gray-200 pt-6">
            <div className="bg-indigo-50 p-4 rounded-md">
              <p className="text-sm text-gray-700">
                You will be redirected to PayPal to complete your payment securely.
              </p>
            </div>
          </div>
        )}

        {paymentMethod === 'stripe' && (
          <div className="border-t border-gray-200 pt-6">
            <div className="bg-indigo-50 p-4 rounded-md">
              <p className="text-sm text-gray-700">
                You will be redirected to Stripe to complete your payment securely.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Shipping
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className={`bg-indigo-600 py-2 px-4 text-white rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isProcessing ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isProcessing ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Processing...
              </>
            ) : (
              `Pay ${calculateCartTotal() > 0 ? `$${(calculateCartTotal() + 10 + calculateCartTotal() * 0.07).toFixed(2)}` : '$0.00'}`
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PaymentForm
