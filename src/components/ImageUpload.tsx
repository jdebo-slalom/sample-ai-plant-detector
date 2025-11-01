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
          border: `2px dashed ${isDragging ? '#4CAF50' : '#ccc'}`,
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragging ? '#f0f8f0' : '#fafafa',
          transition: 'all 0.3s ease'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>
          {isDragging ? 'Drop image here' : 'Drag & drop an image or click to select'}
        </p>
        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#999' }}>
          Supports: JPEG, PNG, WebP (max 5MB)
        </p>
      </div>
      {error && (
        <p style={{ color: '#f44336', marginTop: '8px', fontSize: '14px' }}>
          {error}
        </p>
      )}
    </div>
  );
};
