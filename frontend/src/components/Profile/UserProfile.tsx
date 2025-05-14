import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ProfilePicture from './ProfilePicture'
import Loader from '../UI/Loader'
import Alert from '../UI/Alert'

const UserProfile = () => {
  const { user, isLoading } = useAuth()
  const location = useLocation()
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  
  // Check if we have an order success message from checkout
  useEffect(() => {
    if (location.state?.orderSuccess) {
      setShowSuccessAlert(true)
      
      // Clear the location state after showing the alert
      window.history.replaceState({}, document.title)
      
      // Auto-hide the alert after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessAlert(false)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [location.state])

  if (isLoading) {
    return <Loader />
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">
          Please sign in to view your profile
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {showSuccessAlert && (
        <Alert
          type="success"
          message={`Order #${location.state?.orderId || ''} placed successfully! You can track it in your order history.`}
          onClose={() => setShowSuccessAlert(false)}
        />
      )}
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg leading-6 font-medium text-gray-900">User Profile</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Personal details and account information
            </p>
          </div>
          <ProfilePicture />
        </div>
        
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.first_name} {user.last_name}
              </dd>
            </div>
            
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Username</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.username}
              </dd>
            </div>
            
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.email}
              </dd>
            </div>
            
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Phone number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.profile?.phone_number || 'Not provided'}
              </dd>
            </div>
            
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.profile?.address ? (
                  <div>
                    <p>{user.profile.address}</p>
                    <p>
                      {user.profile.city}{user.profile.state ? `, ${user.profile.state}` : ''} {user.profile.postal_code}
                    </p>
                    <p>{user.profile.country}</p>
                  </div>
                ) : (
                  'No address provided'
                )}
              </dd>
            </div>
            
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Date of birth</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.profile?.date_of_birth || 'Not provided'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
