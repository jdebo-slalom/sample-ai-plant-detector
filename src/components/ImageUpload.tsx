import { useState, useRef } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { validateImage } from '../utils/imageUtils'

interface ImageUploadProps {
  onImageSelect: (file: File) => void
}

export const ImageUpload = ({ onImageSelect }: ImageUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    const validationError = validateImage(file)
    if (validationError) {
      setError(validationError)
      return
    }
    
    setError(null)
    onImageSelect(file)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  return (
    <div
      style={{
        border: `2px dashed ${isDragOver ? '#646cff' : '#ccc'}`,
        borderRadius: 'clamp(8px, 1vw, 12px)',
        padding: 'clamp(20px, 4vw, 40px)',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: isDragOver ? '#f0f0ff' : '#fafafa',
        transition: 'all 0.2s ease',
        minHeight: 'clamp(150px, 20vw, 200px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <CloudUploadIcon style={{
        fontSize: 'clamp(48px, 8vw, 64px)',
        color: isDragOver ? '#646cff' : '#999',
        marginBottom: 'clamp(8px, 2vw, 16px)',
      }} />
      
      <h3 style={{ margin: '0 0 clamp(8px, 2vw, 16px) 0', fontSize: 'clamp(16px, 3vw, 20px)' }}>
        Upload Plant Image
      </h3>
      <p style={{ margin: 0, color: '#666', fontSize: 'clamp(12px, 2vw, 14px)' }}>
        Drag and drop an image here, or click to select
      </p>
      <p style={{ margin: 'clamp(4px, 1vw, 8px) 0 0 0', color: '#999', fontSize: 'clamp(10px, 1.5vw, 12px)' }}>
        Supports JPEG, PNG, WebP (max 5MB)
      </p>
      
      {error && (
        <div style={{
          marginTop: 'clamp(8px, 2vw, 16px)',
          padding: 'clamp(8px, 2vw, 12px)',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: 'clamp(4px, 1vw, 6px)',
          fontSize: 'clamp(12px, 2vw, 14px)',
        }}>
          {error}
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}
