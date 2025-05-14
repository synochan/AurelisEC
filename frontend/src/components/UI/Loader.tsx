interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white'
  fullScreen?: boolean
  message?: string
}

const Loader = ({ 
  size = 'md', 
  color = 'primary',
  fullScreen = false,
  message
}: LoaderProps) => {
  // Size classes
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }
  
  // Color classes
  const colorMap = {
    primary: 'text-indigo-600',
    white: 'text-white'
  }
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-50">
        <svg className={`animate-spin ${sizeMap[size]} ${colorMap[color]}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {message && (
          <p className="mt-4 text-gray-600 font-medium">{message}</p>
        )}
      </div>
    )
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <svg className={`animate-spin ${sizeMap[size]} ${colorMap[color]}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {message && (
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      )}
    </div>
  )
}

export default Loader
