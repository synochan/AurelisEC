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
    () => apiService.fetchProducts(params),
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 2,
      onError: (error) => {
        console.error('Error fetching products:', error);
      }
    }
  )
}

export const useProduct = (slug: string) => {
  return useQuery(
    [QUERY_KEYS.PRODUCT, slug],
    () => apiService.fetchProductBySlug(slug),
    {
      enabled: !!slug,
      staleTime: 1000 * 60 * 10, // 10 minutes
      cacheTime: 1000 * 60 * 60, // 60 minutes - product details rarely change
      refetchOnWindowFocus: false,
      retry: 2,
      onError: (error) => {
        console.error(`Error fetching product ${slug}:`, error);
      }
    }
  )
}

export const useFeaturedProducts = () => {
  return useQuery(
    [QUERY_KEYS.FEATURED_PRODUCTS],
    () => apiService.fetchFeaturedProducts(),
    {
      staleTime: 1000 * 60 * 15, // 15 minutes
      cacheTime: 1000 * 60 * 60, // 60 minutes
      refetchOnWindowFocus: false,
      retry: 2,
      // Featured products are important for the home page so let's keep them fresh
      refetchOnMount: true,
      onError: (error) => {
        console.error('Error fetching featured products:', error);
      }
    }
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
      // On success, we invalidate the orders query and show the updated list
      onSuccess: (data) => {
        // Invalidate orders list
        queryClient.invalidateQueries([QUERY_KEYS.ORDERS])
        
        // Update the cache with the newly created order
        queryClient.setQueryData([QUERY_KEYS.ORDER, data.id], data)
        
        // Return the data for easier access by the component
        return data
      },
      // Add error handling
      onError: (error) => {
        console.error('Error creating order:', error)
      },
      // Retry up to 2 times on failure
      retry: 2,
    }
  )
}