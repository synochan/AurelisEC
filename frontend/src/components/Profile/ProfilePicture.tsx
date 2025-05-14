import { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { updateProfilePicture } from '../../utils/api'
import Modal from '../UI/Modal'
import Alert from '../UI/Alert'

const ProfilePicture = () => {
  const { user, refreshUser } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const profilePicUrl = user?.profile?.profile_picture || null
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Validate file type
    if (!file.type.includes('image/')) {
      setError('Please select an image file')
      return
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB')
      return
    }
    
    setError(null)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }
  
  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      setError('Please select an image first')
      return
    }
    
    const file = fileInputRef.current.files[0]
    
    try {
      setIsUploading(true)
      setError(null)
      
      const formData = new FormData()
      formData.append('profile_picture', file)
      
      await updateProfilePicture(formData)
      
      // Refresh user data to get the updated profile picture
      await refreshUser()
      
      setSuccess('Profile picture updated successfully')
      setIsModalOpen(false)
      setPreviewUrl(null)
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }
  
  return (
    <>
      <div className="relative group">
        <div 
          className="h-20 w-20 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          {profilePicUrl ? (
            <img 
              src={profilePicUrl} 
              alt={user?.username || 'User'} 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-indigo-100 flex items-center justify-center">
              <span className="text-2xl font-medium text-indigo-600">
                {user?.first_name?.[0] || user?.username?.[0] || 'U'}
              </span>
            </div>
          )}
        </div>
        <div 
          className="absolute inset-0 rounded-full bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <i className="fas fa-camera text-white"></i>
        </div>
      </div>
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false)
          setPreviewUrl(null)
          setError(null)
        }}
        title="Update Profile Picture"
      >
        <div className="p-4">
          {error && (
            <Alert 
              type="error" 
              message={error} 
              onClose={() => setError(null)} 
            />
          )}
          
          <div className="mb-6 flex justify-center">
            <div className="h-40 w-40 rounded-full overflow-hidden border-2 border-gray-200">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="h-full w-full object-cover"
                />
              ) : profilePicUrl ? (
                <img 
                  src={profilePicUrl} 
                  alt={user?.username || 'User'} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-4xl font-medium text-indigo-600">
                    {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="form-label mb-1">Select Image</label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              Recommended: Square image, max size 2MB
            </p>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                setPreviewUrl(null)
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={!previewUrl || isUploading}
              className={`btn-primary ${!previewUrl || isUploading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {isUploading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Uploading...
                </>
              ) : (
                'Upload'
              )}
            </button>
          </div>
        </div>
      </Modal>
      
      {success && (
        <Alert 
          type="success" 
          message={success} 
          onClose={() => setSuccess(null)} 
        />
      )}
    </>
  )
}

export default ProfilePicture
