import { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { getUserProfile } from '../utils/api'
import { getToken, setToken, removeToken, isTokenExpired, refreshToken } from '../utils/auth'
import { User } from '../types'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  checkAuthStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async () => {},
  logout: () => {},
  refreshUser: async () => {},
  checkAuthStatus: async () => {}
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>(null)

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      
      // Store tokens
      setToken('access', data.access)
      setToken('refresh', data.refresh)
      
      // Set authentication state
      setIsAuthenticated(true)
      
      // Get user profile
      await refreshUser()
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    // Remove tokens
    removeToken('access')
    removeToken('refresh')
    
    // Reset state
    setIsAuthenticated(false)
    setUser(null)
  }

  const refreshUser = async () => {
    try {
      const userData = await getUserProfile()
      setUser(userData)
    } catch (error) {
      console.error('Failed to get user profile:', error)
      throw error
    }
  }

  const checkAuthStatus = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Check if the user has a token
      const token = getToken('access')
      
      if (!token) {
        setIsAuthenticated(false)
        setUser(null)
        return
      }
      
      // Check if the token is expired
      if (isTokenExpired(token)) {
        // Try to refresh the token
        try {
          await refreshToken()
        } catch (error) {
          // If refresh fails, logout
          logout()
          return
        }
      }
      
      // Get user profile
      await refreshUser()
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Auth check error:', error)
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      login,
      logout,
      refreshUser,
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  )
}
