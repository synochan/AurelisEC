import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchOrders } from '../../utils/api'
import { Order } from '../../types'
import Loader from '../UI/Loader'
import { formatDate } from '../../utils/helpers'

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await fetchOrders()
        setOrders(data)
      } catch (err) {
        console.error('Failed to load orders:', err)
        setError('Failed to load your order history. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    
    loadOrders()
  }, [])
  
  if (loading) {
    return <Loader />
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }
  
  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
        <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
        <Link to="/products" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Order History</h2>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200"
          >
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Order #{order.id}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Placed on {formatDate(order.created_at)}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(order.status)}`}>
                  {getFormattedStatus(order.status)}
                </span>
                <span className="font-semibold text-gray-900">${order.total_price.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      {item.product.featured_image ? (
                        <img
                          src={item.product.featured_image.image}
                          alt={item.product.name}
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-100">
                          <i className="fas fa-tshirt text-gray-400"></i>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <Link 
                        to={`/products/${item.product.slug}`}
                        className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                      >
                        {item.product.name}
                      </Link>
                      
                      <div className="mt-1 flex text-xs text-gray-500">
                        <span>Qty: {item.quantity}</span>
                        {item.color && <span className="ml-2">Color: {item.color}</span>}
                        {item.size && <span className="ml-2">Size: {item.size}</span>}
                      </div>
                    </div>
                    
                    <div className="text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              {order.payment && (
                <div className="mt-4 text-sm text-gray-600">
                  <p>Payment: {getPaymentMethodText(order.payment.payment_method)}</p>
                  <p>Status: {getPaymentStatusText(order.payment.status)}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper functions
const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'processing':
      return 'bg-blue-100 text-blue-800'
    case 'shipped':
      return 'bg-purple-100 text-purple-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getFormattedStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const getPaymentMethodText = (method: string): string => {
  switch (method) {
    case 'credit_card':
      return 'Credit Card'
    case 'paypal':
      return 'PayPal'
    case 'stripe':
      return 'Stripe'
    default:
      return method
  }
}

const getPaymentStatusText = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export default OrderHistory
