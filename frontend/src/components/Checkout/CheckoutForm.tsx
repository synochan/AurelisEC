import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void
}

export interface CheckoutFormData {
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

const CheckoutForm = ({ onSubmit }: CheckoutFormProps) => {
  const { user } = useAuth()
  const [useSavedAddress, setUseSavedAddress] = useState(false)
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<CheckoutFormData>({
    defaultValues: {
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      email: user?.email || '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: ''
    }
  })

  const handleUseSavedAddress = () => {
    if (user?.profile) {
      setValue('address', user.profile.address || '')
      setValue('city', user.profile.city || '')
      setValue('state', user.profile.state || '')
      setValue('postalCode', user.profile.postal_code || '')
      setValue('country', user.profile.country || '')
      setValue('phone', user.profile.phone_number || '')
    }
    
    setUseSavedAddress(!useSavedAddress)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-xl font-medium text-gray-900">Contact Information</h2>
        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <div>
            <label htmlFor="firstName" className="form-label">
              First name
            </label>
            <input
              id="firstName"
              type="text"
              {...register('firstName', { required: 'First name is required' })}
              className={`form-input ${errors.firstName ? 'border-red-500' : ''}`}
            />
            {errors.firstName && (
              <p className="mt-1 text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="form-label">
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              {...register('lastName', { required: 'Last name is required' })}
              className={`form-input ${errors.lastName ? 'border-red-500' : ''}`}
            />
            {errors.lastName && (
              <p className="mt-1 text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={`form-input ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              {...register('phone', { required: 'Phone number is required' })}
              className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
            />
            {errors.phone && (
              <p className="mt-1 text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-xl font-medium text-gray-900">Shipping Information</h2>
        
        {user && (
          <div className="mt-4">
            <div className="flex items-center">
              <input
                id="use-saved-address"
                name="use-saved-address"
                type="checkbox"
                checked={useSavedAddress}
                onChange={handleUseSavedAddress}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="use-saved-address" className="ml-2 text-sm text-gray-700">
                Use my saved address
              </label>
            </div>
          </div>
        )}
        
        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <div className="sm:col-span-2">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              id="address"
              type="text"
              {...register('address', { required: 'Address is required' })}
              className={`form-input ${errors.address ? 'border-red-500' : ''}`}
            />
            {errors.address && (
              <p className="mt-1 text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="city" className="form-label">
              City
            </label>
            <input
              id="city"
              type="text"
              {...register('city', { required: 'City is required' })}
              className={`form-input ${errors.city ? 'border-red-500' : ''}`}
            />
            {errors.city && (
              <p className="mt-1 text-red-500 text-sm">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="state" className="form-label">
              State / Province
            </label>
            <input
              id="state"
              type="text"
              {...register('state', { required: 'State is required' })}
              className={`form-input ${errors.state ? 'border-red-500' : ''}`}
            />
            {errors.state && (
              <p className="mt-1 text-red-500 text-sm">{errors.state.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="postalCode" className="form-label">
              Postal code
            </label>
            <input
              id="postalCode"
              type="text"
              {...register('postalCode', { required: 'Postal code is required' })}
              className={`form-input ${errors.postalCode ? 'border-red-500' : ''}`}
            />
            {errors.postalCode && (
              <p className="mt-1 text-red-500 text-sm">{errors.postalCode.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="country" className="form-label">
              Country
            </label>
            <select
              id="country"
              {...register('country', { required: 'Country is required' })}
              className={`form-input ${errors.country ? 'border-red-500' : ''}`}
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
            {errors.country && (
              <p className="mt-1 text-red-500 text-sm">{errors.country.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  )
}

export default CheckoutForm
