import { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { validateImage, createImagePreview } from '../utils/imageUtils';
import type { UploadedImage } from '../types';

interface ImageUploadProps {
  onImageSelect: (image: UploadedImage) => void;
}

export const ImageUpload = ({ onImageSelect }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const validationError = validateImage(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    const preview = createImagePreview(file);
    onImageSelect({ file, preview });
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          border: `3px dashed ${isDragging ? '#4CAF50' : '#d0d0d0'}`,
          borderRadius: '16px',
          padding: 'clamp(40px, 8vw, 80px) clamp(20px, 4vw, 40px)',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragging ? '#e8f5e9' : '#ffffff',
          transition: 'all 0.3s ease',
          boxShadow: isDragging ? '0 8px 24px rgba(76, 175, 80, 0.2)' : '0 4px 12px rgba(0,0,0,0.08)',
          maxWidth: '800px',
          margin: '0 auto'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        <div style={{ fontSize: 'clamp(36px, 10vw, 64px)', marginBottom: 'clamp(12px, 3vw, 20px)' }}>
          {isDragging ? '🎯' : '📷'}
        </div>
        <p style={{ 
          margin: 0, 
          fontSize: 'clamp(15px, 4vw, 20px)', 
          color: '#333', 
          fontWeight: '600',
          marginBottom: '8px',
          lineHeight: '1.3'
        }}>
          {isDragging ? 'Drop image here' : 'Drag & drop an image'}
        </p>
        <p style={{ 
          margin: '8px 0 0', 
          fontSize: 'clamp(12px, 3vw, 15px)', 
          color: '#999',
          lineHeight: '1.4'
        }}>
          or click to browse
        </p>
        <div style={{
          marginTop: 'clamp(16px, 4vw, 24px)',
          padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          display: 'inline-block'
        }}>
          <p style={{ margin: 0, fontSize: 'clamp(11px, 2vw, 13px)', color: '#6c757d' }}>
            ✅ JPEG, PNG, WebP • Max 5MB
          </p>
        </div>
      </div>
      {error && (
        <div style={{ 
          marginTop: '12px', 
          padding: '12px', 
          backgroundColor: '#ffebee', 
          borderRadius: '8px',
          color: '#c62828',
          fontSize: '14px',
          border: '1px solid #ef9a9a'
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};
