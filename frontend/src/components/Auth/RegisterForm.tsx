import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { registerUser } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import Alert from '../UI/Alert'

type RegisterFormInputs = {
  username: string
  email: string
  password: string
  password2: string
  first_name: string
  last_name: string
}

const RegisterForm = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterFormInputs>()

  const password = watch('password')

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      setLoading(true)
      setError(null)
      
      // Register the user
      await registerUser(data)
      
      setSuccess('Registration successful! Signing you in...')
      
      // Log in the user with the new credentials
      setTimeout(async () => {
        try {
          await login(data.username, data.password)
          navigate('/')
        } catch (err) {
          console.error('Auto-login error:', err)
          setError('Registration successful, but there was a problem signing you in. Please try to login manually.')
        }
      }, 1500)
    } catch (err: any) {
      console.error('Registration error:', err)
      
      if (err.response && err.response.data) {
        // Handle validation errors from backend
        const backendErrors = err.response.data
        const firstError = Object.values(backendErrors)[0]
        
        if (Array.isArray(firstError) && firstError.length > 0) {
          setError(firstError[0] as string)
        } else {
          setError('Registration failed. Please try again.')
        }
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 py-10 px-8 shadow-lg rounded-lg max-w-md mx-auto">
      <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-8">Create your account</h2>
      
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}
      
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}
      
      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              First name
            </label>
            <input
              id="first_name"
              type="text"
              {...register('first_name', { required: 'First name is required' })}
              className={`block w-full rounded-md px-4 py-3 text-gray-900 border ${errors.first_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:border-black focus:ring-black dark:bg-gray-800 dark:text-white`}
            />
            {errors.first_name && (
              <p className="mt-2 text-red-600 text-sm">{errors.first_name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last name
            </label>
            <input
              id="last_name"
              type="text"
              {...register('last_name', { required: 'Last name is required' })}
              className={`block w-full rounded-md px-4 py-3 text-gray-900 border ${errors.last_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:border-black focus:ring-black dark:bg-gray-800 dark:text-white`}
            />
            {errors.last_name && (
              <p className="mt-2 text-red-600 text-sm">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            {...register('username', { 
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters'
              }
            })}
            className={`block w-full rounded-md px-4 py-3 text-gray-900 border ${errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:border-black focus:ring-black dark:bg-gray-800 dark:text-white`}
          />
          {errors.username && (
            <p className="mt-2 text-red-600 text-sm">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
            className={`block w-full rounded-md px-4 py-3 text-gray-900 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:border-black focus:ring-black dark:bg-gray-800 dark:text-white`}
          />
          {errors.email && (
            <p className="mt-2 text-red-600 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })}
            className={`block w-full rounded-md px-4 py-3 text-gray-900 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:border-black focus:ring-black dark:bg-gray-800 dark:text-white`}
          />
          {errors.password && (
            <p className="mt-2 text-red-600 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm Password
          </label>
          <input
            id="password2"
            type="password"
            {...register('password2', { 
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match'
            })}
            className={`block w-full rounded-md px-4 py-3 text-gray-900 border ${errors.password2 ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:border-black focus:ring-black dark:bg-gray-800 dark:text-white`}
          />
          {errors.password2 && (
            <p className="mt-2 text-red-600 text-sm">{errors.password2.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
        </div>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">Already have an account?</span>
          </div>
        </div>

        <div className="mt-6">
          <Link
            to="/login"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-base font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm
