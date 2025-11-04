import DeleteIcon from '@mui/icons-material/Delete'

interface ImagePreviewProps {
  imageUrl: string
  fileName: string
  fileSize: number
  onRemove: () => void
}

export const ImagePreview = ({ imageUrl, fileName, fileSize, onRemove }: ImagePreviewProps) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div style={{
      border: '2px solid #e0e0e0',
      borderRadius: 'clamp(8px, 1vw, 12px)',
      padding: 'clamp(16px, 3vw, 24px)',
      textAlign: 'center',
      backgroundColor: '#fafafa',
      transition: 'all 0.2s ease',
    }}>
      <div style={{
        position: 'relative',
        display: 'inline-block',
        marginBottom: 'clamp(12px, 2vw, 16px)',
      }}>
        <img
          src={imageUrl}
          alt="Plant preview"
          style={{
            maxWidth: '100%',
            maxHeight: 'clamp(200px, 30vw, 300px)',
            objectFit: 'contain',
            borderRadius: 'clamp(4px, 1vw, 8px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
          }}
        />
      </div>
      
      <div style={{
        marginBottom: 'clamp(12px, 2vw, 16px)',
        fontSize: 'clamp(12px, 2vw, 14px)',
        color: '#666',
        transition: 'color 0.2s ease',
      }}>
        <div style={{ fontWeight: 500, marginBottom: 'clamp(4px, 1vw, 8px)' }}>
          {fileName}
        </div>
        <div>
          {formatFileSize(fileSize)}
        </div>
      </div>
      
      <button
        onClick={onRemove}
        style={{
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: 'clamp(4px, 1vw, 6px)',
          padding: 'clamp(8px, 2vw, 12px) clamp(16px, 3vw, 24px)',
          fontSize: 'clamp(12px, 2vw, 14px)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(4px, 1vw, 6px)',
          margin: '0 auto',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#d32f2f'
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#f44336'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <DeleteIcon style={{ fontSize: 'clamp(14px, 2vw, 16px)' }} />
        Remove Image
      </button>
    </div>
  )
}
