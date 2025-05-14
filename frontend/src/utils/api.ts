import axios from 'axios'
import { getToken, refreshToken } from './auth'
import { Product, Category, User, Order } from '../types'

// Create axios instance
const api = axios.create({
  baseURL: '/api'
})

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken('access')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // Attempt token refresh
        await refreshToken()
        
        // Update authorization header with new token
        const newToken = getToken('access')
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }
        
        // Retry the original request
        return api(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

// Products API
export const fetchProducts = async (params?: URLSearchParams) => {
  const response = await api.get('/products/', { params })
  return response.data as Product[]
}

export const fetchProductBySlug = async (slug: string) => {
  const response = await api.get(`/products/${slug}/`)
  return response.data as Product
}

export const fetchFeaturedProducts = async () => {
  const response = await api.get('/products/featured/')
  return response.data as Product[]
}

// Categories API
export const fetchCategories = async () => {
  const response = await api.get('/products/categories/')
  return response.data as Category[]
}

// User Authentication API
export const registerUser = async (userData: {
  username: string
  email: string
  password: string
  password2: string
  first_name: string
  last_name: string
}) => {
  const response = await api.post('/accounts/register/', userData)
  return response.data
}

export const getUserProfile = async () => {
  const response = await api.get('/accounts/profile/')
  return response.data as User
}

export const updateUserProfile = async (profileData: {
  first_name: string
  last_name: string
  profile: {
    phone_number?: string
    address?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
    date_of_birth?: string
  }
}) => {
  const response = await api.put('/accounts/profile/', profileData)
  return response.data
}

export const updatePassword = async (passwordData: {
  old_password: string
  new_password: string
  confirm_password: string
}) => {
  const response = await api.put('/accounts/change-password/', passwordData)
  return response.data
}

export const updateProfilePicture = async (formData: FormData) => {
  const response = await api.put('/accounts/profile-picture/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

// Orders API
export const fetchOrders = async () => {
  const response = await api.get('/orders/')
  return response.data as Order[]
}

export const fetchOrderById = async (id: number) => {
  const response = await api.get(`/orders/${id}/`)
  return response.data as Order
}

export const createOrder = async (orderData: {
  first_name: string
  last_name: string
  email: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  phone: string
  items: Array<{
    product: number
    quantity: number
    color?: string
    size?: string
  }>
  payment_method: string
}) => {
  const response = await api.post('/orders/', orderData)
  return response.data as Order
}

export default api
