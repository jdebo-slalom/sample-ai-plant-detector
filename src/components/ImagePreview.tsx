import type { UploadedImage } from '../types';

interface ImagePreviewProps {
  image: UploadedImage;
  onRemove: () => void;
}

export const ImagePreview = ({ image, onRemove }: ImagePreviewProps) => {
  return (
    <div>
      <div style={{ 
        position: 'relative', 
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: 'clamp(12px, 2vw, 20px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        <div style={{ position: 'relative' }}>
          <img
            src={image.preview}
            alt="Preview"
            style={{
              width: '100%',
              maxHeight: 'clamp(300px, 50vh, 600px)',
              objectFit: 'contain',
              borderRadius: '12px',
              backgroundColor: '#f5f5f5'
            }}
          />
          <button
            onClick={onRemove}
            style={{
              position: 'absolute',
              top: 'clamp(8px, 2vw, 16px)',
              right: 'clamp(8px, 2vw, 16px)',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: 'clamp(32px, 5vw, 40px)',
              height: 'clamp(32px, 5vw, 40px)',
              cursor: 'pointer',
              fontSize: 'clamp(18px, 3vw, 22px)',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
            title="Remove image"
          >
            ×
          </button>
        </div>
        <div style={{ 
          marginTop: '12px', 
          padding: 'clamp(8px, 1.5vw, 12px)',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          fontSize: 'clamp(12px, 1.8vw, 14px)', 
          color: '#666',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <span style={{ 
            fontWeight: '500', 
            color: '#333',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: '1',
            minWidth: '0'
          }}>
            📄 {image.file.name}
          </span>
          <span style={{ 
            fontWeight: '600',
            color: '#4CAF50',
            whiteSpace: 'nowrap'
          }}>
            {(image.file.size / 1024).toFixed(1)} KB
          </span>
        </div>
      </div>
    </div>
  );
};
