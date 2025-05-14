import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import RegisterForm from '../components/Auth/RegisterForm'

const RegisterPage = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  
  // Update page title
  useEffect(() => {
    document.title = 'Register | FashionTrend'
    
    return () => {
      document.title = 'FashionTrend | Modern Apparel Store'
    }
  }, [])
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/')
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }
  
  if (isAuthenticated) {
    return null // Will redirect in the useEffect
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Create Account</h1>
      <RegisterForm />
    </div>
  )
}

export default RegisterPage
