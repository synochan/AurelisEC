import jwt_decode from 'jwt-decode'

interface JwtPayload {
  exp: number
  iat: number
  jti: string
  token_type: string
  user_id: number
}

// Token management
export const getToken = (type: 'access' | 'refresh'): string | null => {
  return localStorage.getItem(`${type}_token`)
}

export const setToken = (type: 'access' | 'refresh', token: string): void => {
  localStorage.setItem(`${type}_token`, token)
}

export const removeToken = (type: 'access' | 'refresh'): void => {
  localStorage.removeItem(`${type}_token`)
}

// Check if a token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt_decode<JwtPayload>(token)
    const currentTime = Date.now() / 1000
    
    // Check if token expiration time is less than current time
    return decoded.exp < currentTime
  } catch (error) {
    // If there's an error decoding the token, consider it expired
    return true
  }
}

// Refresh the access token using the refresh token
export const refreshToken = async (): Promise<void> => {
  const refresh = getToken('refresh')
  
  if (!refresh) {
    throw new Error('No refresh token available')
  }
  
  try {
    const response = await fetch('/api/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh })
    })
    
    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }
    
    const data = await response.json()
    setToken('access', data.access)
    
    // Some APIs might return a new refresh token as well
    if (data.refresh) {
      setToken('refresh', data.refresh)
    }
  } catch (error) {
    // If refresh fails, clear tokens
    removeToken('access')
    removeToken('refresh')
    throw error
  }
}

// Get user ID from token
export const getUserIdFromToken = (): number | null => {
  const token = getToken('access')
  
  if (!token) {
    return null
  }
  
  try {
    const decoded = jwt_decode<JwtPayload>(token)
    return decoded.user_id
  } catch (error) {
    return null
  }
}
