import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as apiService from '../utils/api'
import { Product, Category, User, Order } from '../types'

// Query keys
export const QUERY_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  FEATURED_PRODUCTS: 'featuredProducts',
  CATEGORIES: 'categories',
  USER_PROFILE: 'userProfile',
  ORDERS: 'orders',
  ORDER: 'order',
}

// Products queries
export const useProducts = (params?: URLSearchParams) => {
  return useQuery(
    [QUERY_KEYS.PRODUCTS, params?.toString()],
    () => apiService.fetchProducts(params)
  )
}

export const useProduct = (slug: string) => {
  return useQuery(
    [QUERY_KEYS.PRODUCT, slug],
    () => apiService.fetchProductBySlug(slug),
    {
      enabled: !!slug,
    }
  )
}

export const useFeaturedProducts = () => {
  return useQuery(
    [QUERY_KEYS.FEATURED_PRODUCTS],
    () => apiService.fetchFeaturedProducts()
  )
}

// Categories queries
export const useCategories = () => {
  return useQuery(
    [QUERY_KEYS.CATEGORIES],
    () => apiService.fetchCategories()
  )
}

// User queries
export const useUserProfile = () => {
  return useQuery(
    [QUERY_KEYS.USER_PROFILE],
    () => apiService.getUserProfile()
  )
}

// User mutations
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    (profileData: any) => apiService.updateUserProfile(profileData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEYS.USER_PROFILE])
      },
    }
  )
}

export const useUpdatePassword = () => {
  return useMutation(
    (passwordData: any) => apiService.updatePassword(passwordData)
  )
}

export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    (formData: FormData) => apiService.updateProfilePicture(formData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEYS.USER_PROFILE])
      },
    }
  )
}

export const useRegisterUser = () => {
  return useMutation(
    (userData: any) => apiService.registerUser(userData)
  )
}

// Orders queries
export const useOrders = () => {
  return useQuery(
    [QUERY_KEYS.ORDERS],
    () => apiService.fetchOrders()
  )
}

export const useOrder = (id: number) => {
  return useQuery(
    [QUERY_KEYS.ORDER, id],
    () => apiService.fetchOrderById(id),
    {
      enabled: !!id,
    }
  )
}

// Orders mutations
export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    (orderData: any) => apiService.createOrder(orderData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEYS.ORDERS])
      },
    }
  )
}