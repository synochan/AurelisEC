import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { updateUserProfile, updatePassword } from '../../utils/api'
import Loader from '../UI/Loader'
import Alert from '../UI/Alert'

type ProfileFormData = {
  first_name: string
  last_name: string
  phone_number: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  date_of_birth: string
}

type PasswordFormData = {
  old_password: string
  new_password: string
  confirm_password: string
}

const UserSettings = () => {
  const { user, isLoading, refreshUser } = useAuth()
  
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')
  const [isUpdating, setIsUpdating] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfileForm
  } = useForm<ProfileFormData>({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone_number: user?.profile?.phone_number || '',
      address: user?.profile?.address || '',
      city: user?.profile?.city || '',
      state: user?.profile?.state || '',
      postal_code: user?.profile?.postal_code || '',
      country: user?.profile?.country || '',
      date_of_birth: user?.profile?.date_of_birth || ''
    }
  })
  
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
    watch: watchPassword
  } = useForm<PasswordFormData>()
  
  const newPassword = watchPassword('new_password')
  
  const onSubmitProfile: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      setIsUpdating(true)
      setProfileError(null)
      setProfileSuccess(null)
      
      const profileData = {
        first_name: data.first_name,
        last_name: data.last_name,
        profile: {
          phone_number: data.phone_number,
          address: data.address,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
          country: data.country,
          date_of_birth: data.date_of_birth
        }
      }
      
      await updateUserProfile(profileData)
      await refreshUser()
      
      setProfileSuccess('Profile updated successfully')
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setProfileSuccess(null)
      }, 3000)
    } catch (err) {
      console.error('Profile update error:', err)
      setProfileError('Failed to update profile. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }
  
  const onSubmitPassword: SubmitHandler<PasswordFormData> = async (data) => {
    try {
      setIsUpdating(true)
      setPasswordError(null)
      setPasswordSuccess(null)
      
      await updatePassword({
        old_password: data.old_password,
        new_password: data.new_password,
        confirm_password: data.confirm_password
      })
      
      setPasswordSuccess('Password updated successfully')
      resetPasswordForm()
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setPasswordSuccess(null)
      }, 3000)
    } catch (err: any) {
      console.error('Password update error:', err)
      
      if (err.response?.data?.old_password) {
        setPasswordError(err.response.data.old_password[0])
      } else if (err.response?.data?.new_password) {
        setPasswordError(err.response.data.new_password[0])
      } else {
        setPasswordError('Failed to update password. Please try again.')
      }
    } finally {
      setIsUpdating(false)
    }
  }
  
  if (isLoading) {
    return <Loader />
  }
  
  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">
          Please sign in to access settings
        </p>
      </div>
    )
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveTab('profile')}
            className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'password'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Change Password
          </button>
        </nav>
      </div>
      
      {/* Profile Information Form */}
      {activeTab === 'profile' && (
        <div>
          {profileSuccess && (
            <Alert
              type="success"
              message={profileSuccess}
              onClose={() => setProfileSuccess(null)}
            />
          )}
          
          {profileError && (
            <Alert
              type="error"
              message={profileError}
              onClose={() => setProfileError(null)}
            />
          )}
          
          <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <label htmlFor="first_name" className="form-label">
                  First name
                </label>
                <input
                  id="first_name"
                  type="text"
                  {...registerProfile('first_name', { required: 'First name is required' })}
                  className={`form-input ${profileErrors.first_name ? 'border-red-500' : ''}`}
                />
                {profileErrors.first_name && (
                  <p className="mt-1 text-red-500 text-sm">{profileErrors.first_name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="last_name" className="form-label">
                  Last name
                </label>
                <input
                  id="last_name"
                  type="text"
                  {...registerProfile('last_name', { required: 'Last name is required' })}
                  className={`form-input ${profileErrors.last_name ? 'border-red-500' : ''}`}
                />
                {profileErrors.last_name && (
                  <p className="mt-1 text-red-500 text-sm">{profileErrors.last_name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone_number" className="form-label">
                  Phone number
                </label>
                <input
                  id="phone_number"
                  type="text"
                  {...registerProfile('phone_number')}
                  className="form-input"
                />
              </div>

              <div>
                <label htmlFor="date_of_birth" className="form-label">
                  Date of birth
                </label>
                <input
                  id="date_of_birth"
                  type="date"
                  {...registerProfile('date_of_birth')}
                  className="form-input"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  {...registerProfile('address')}
                  className="form-input"
                />
              </div>

              <div>
                <label htmlFor="city" className="form-label">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  {...registerProfile('city')}
                  className="form-input"
                />
              </div>

              <div>
                <label htmlFor="state" className="form-label">
                  State / Province
                </label>
                <input
                  id="state"
                  type="text"
                  {...registerProfile('state')}
                  className="form-input"
                />
              </div>

              <div>
                <label htmlFor="postal_code" className="form-label">
                  Postal code
                </label>
                <input
                  id="postal_code"
                  type="text"
                  {...registerProfile('postal_code')}
                  className="form-input"
                />
              </div>

              <div>
                <label htmlFor="country" className="form-label">
                  Country
                </label>
                <select
                  id="country"
                  {...registerProfile('country')}
                  className="form-input"
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                  <option value="CN">China</option>
                  <option value="IN">India</option>
                  <option value="BR">Brazil</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className={`btn-primary ${isUpdating ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isUpdating ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Updating...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Change Password Form */}
      {activeTab === 'password' && (
        <div>
          {passwordSuccess && (
            <Alert
              type="success"
              message={passwordSuccess}
              onClose={() => setPasswordSuccess(null)}
            />
          )}
          
          {passwordError && (
            <Alert
              type="error"
              message={passwordError}
              onClose={() => setPasswordError(null)}
            />
          )}
          
          <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
            <div>
              <label htmlFor="old_password" className="form-label">
                Current Password
              </label>
              <input
                id="old_password"
                type="password"
                {...registerPassword('old_password', { required: 'Current password is required' })}
                className={`form-input ${passwordErrors.old_password ? 'border-red-500' : ''}`}
              />
              {passwordErrors.old_password && (
                <p className="mt-1 text-red-500 text-sm">{passwordErrors.old_password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="new_password" className="form-label">
                New Password
              </label>
              <input
                id="new_password"
                type="password"
                {...registerPassword('new_password', { 
                  required: 'New password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
                className={`form-input ${passwordErrors.new_password ? 'border-red-500' : ''}`}
              />
              {passwordErrors.new_password && (
                <p className="mt-1 text-red-500 text-sm">{passwordErrors.new_password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirm_password" className="form-label">
                Confirm New Password
              </label>
              <input
                id="confirm_password"
                type="password"
                {...registerPassword('confirm_password', { 
                  required: 'Please confirm your password',
                  validate: value => value === newPassword || 'Passwords do not match'
                })}
                className={`form-input ${passwordErrors.confirm_password ? 'border-red-500' : ''}`}
              />
              {passwordErrors.confirm_password && (
                <p className="mt-1 text-red-500 text-sm">{passwordErrors.confirm_password.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className={`btn-primary ${isUpdating ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isUpdating ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Updating...
                  </>
                ) : (
                  'Change Password'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default UserSettings
