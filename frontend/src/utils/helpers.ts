// Format date to a readable string
export const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) {
    return 'Invalid date'
  }
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  
  return date.toLocaleDateString(undefined, options)
}

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Generate a random key
export const generateRandomKey = (length = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

// Truncate text to a certain length
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  
  return text.slice(0, maxLength) + '...'
}

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  return emailRegex.test(email)
}

// Extract error message from API error
export const extractErrorMessage = (error: any): string => {
  if (error.response && error.response.data) {
    const errorData = error.response.data
    
    // Check if error data is a string
    if (typeof errorData === 'string') {
      return errorData
    }
    
    // Check if error data has a detail field
    if (errorData.detail) {
      return errorData.detail
    }
    
    // Check if error data is an object with field errors
    for (const field in errorData) {
      if (Array.isArray(errorData[field])) {
        return `${field}: ${errorData[field][0]}`
      }
    }
    
    // Fallback to JSON stringify if we can't extract a specific message
    return JSON.stringify(errorData)
  }
  
  // If there's an error message, use it
  if (error.message) {
    return error.message
  }
  
  // Last resort fallback
  return 'An unknown error occurred'
}

// Get the initials from a name
export const getInitials = (name: string): string => {
  if (!name) return ''
  
  const parts = name.split(' ')
  
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}
