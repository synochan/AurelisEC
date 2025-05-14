import { useEffect, useState } from 'react'

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  onClose?: () => void
  autoClose?: boolean
  autoCloseTime?: number
}

const Alert = ({ 
  type, 
  message, 
  onClose, 
  autoClose = true, 
  autoCloseTime = 5000 
}: AlertProps) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        if (onClose) {
          onClose()
        }
      }, autoCloseTime)

      return () => clearTimeout(timer)
    }
  }, [autoClose, autoCloseTime, onClose])

  if (!isVisible) {
    return null
  }

  const bgColor = {
    success: 'bg-green-50 border-green-500',
    error: 'bg-red-50 border-red-500',
    warning: 'bg-yellow-50 border-yellow-500',
    info: 'bg-blue-50 border-blue-500'
  }

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  }

  const iconColor = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  }

  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  }

  return (
    <div className={`rounded-md border-l-4 p-4 mb-4 ${bgColor[type]}`} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          <i className={`fas ${icons[type]} ${iconColor[type]}`} aria-hidden="true"></i>
        </div>
        <div className="ml-3">
          <p className={`text-sm ${textColor[type]}`}>{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsVisible(false)
                  onClose()
                }}
                className={`inline-flex rounded-md p-1.5 ${textColor[type]} hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                <span className="sr-only">Dismiss</span>
                <i className="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Alert
