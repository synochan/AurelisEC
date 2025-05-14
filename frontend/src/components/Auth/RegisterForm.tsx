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
    <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
      <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">Create a new account</h2>
      
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
      
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <div>
            <label htmlFor="first_name" className="form-label">
              First name
            </label>
            <input
              id="first_name"
              type="text"
              {...register('first_name', { required: 'First name is required' })}
              className={`form-input ${errors.first_name ? 'border-red-500' : ''}`}
            />
            {errors.first_name && (
              <p className="mt-1 text-red-500 text-sm">{errors.first_name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="last_name" className="form-label">
              Last name
            </label>
            <input
              id="last_name"
              type="text"
              {...register('last_name', { required: 'Last name is required' })}
              className={`form-input ${errors.last_name ? 'border-red-500' : ''}`}
            />
            {errors.last_name && (
              <p className="mt-1 text-red-500 text-sm">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="username" className="form-label">
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
            className={`form-input ${errors.username ? 'border-red-500' : ''}`}
          />
          {errors.username && (
            <p className="mt-1 text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>

        <div>
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

        <div>
          <label htmlFor="password" className="form-label">
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
            className={`form-input ${errors.password ? 'border-red-500' : ''}`}
          />
          {errors.password && (
            <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password2" className="form-label">
            Confirm Password
          </label>
          <input
            id="password2"
            type="password"
            {...register('password2', { 
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match'
            })}
            className={`form-input ${errors.password2 ? 'border-red-500' : ''}`}
          />
          {errors.password2 && (
            <p className="mt-1 text-red-500 text-sm">{errors.password2.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Registering...
              </>
            ) : (
              'Register'
            )}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Already have an account?</span>
          </div>
        </div>

        <div className="mt-6">
          <Link
            to="/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white border-indigo-600 hover:bg-indigo-50"
          >
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm
