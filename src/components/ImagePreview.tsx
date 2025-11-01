import type { UploadedImage } from '../types';

interface ImagePreviewProps {
  image: UploadedImage;
  onRemove: () => void;
}

export const ImagePreview = ({ image, onRemove }: ImagePreviewProps) => {
  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <img
          src={image.preview}
          alt="Preview"
          style={{
            maxWidth: '100%',
            maxHeight: '400px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        />
        <button
          onClick={onRemove}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>
      </div>
      <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
        {image.file.name} ({(image.file.size / 1024).toFixed(1)} KB)
      </p>
    </div>
  );
};
