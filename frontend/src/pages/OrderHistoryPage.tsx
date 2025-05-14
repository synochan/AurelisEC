import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import OrderHistory from '../components/Profile/OrderHistory'

const OrderHistoryPage = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  
  // Update page title
  useEffect(() => {
    document.title = 'Order History | FashionTrend'
    
    return () => {
      document.title = 'FashionTrend | Modern Apparel Store'
    }
  }, [])
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login?redirect=orders')
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return null // Will redirect in the useEffect
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>
      <OrderHistory />
    </div>
  )
}

export default OrderHistoryPage
