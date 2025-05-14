import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import UserProfile from '../components/Profile/UserProfile'

const ProfilePage = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  
  // Update page title
  useEffect(() => {
    document.title = 'My Profile | FashionTrend'
    
    return () => {
      document.title = 'FashionTrend | Modern Apparel Store'
    }
  }, [])
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login?redirect=profile')
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
      <UserProfile />
    </div>
  )
}

export default ProfilePage
