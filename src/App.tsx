import { useState } from 'react'
import { ImageUpload } from './components/ImageUpload'
import { ImagePreview } from './components/ImagePreview'
import { AnalysisResults } from './components/AnalysisResults'
import { analyzePlantImage } from './services/bedrockService'
import { fileToBase64 } from './utils/imageUtils'
import type { UploadedImage, AnalysisResult } from './types'
import './App.css'

function App() {
  const [image, setImage] = useState<UploadedImage | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageSelect = (uploadedImage: UploadedImage) => {
    setImage(uploadedImage)
    setResult(null)
    setError(null)
  }

  const handleRemoveImage = () => {
    if (image?.preview) {
      URL.revokeObjectURL(image.preview)
    }
    setImage(null)
    setResult(null)
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!image) return;

    setIsAnalyzing(true)
    setError(null)

    try {
      const base64 = await fileToBase64(image.file)
      const analysisResult = await analyzePlantImage(base64)
      setResult(analysisResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please check your AWS credentials.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    handleRemoveImage()
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Plant Disease Detector</h1>
      
      {!image ? (
        <ImageUpload onImageSelect={handleImageSelect} />
      ) : (
        <>
          <ImagePreview image={image} onRemove={handleRemoveImage} />
          
          {!result && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                fontSize: '16px',
                backgroundColor: isAnalyzing ? '#ccc' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                width: '100%'
              }}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Plant'}
            </button>
          )}

          {error && (
            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#ffebee', borderRadius: '4px', color: '#c62828' }}>
              {error}
            </div>
          )}

          {result && <AnalysisResults result={result} onReset={handleReset} />}
        </>
      )}
    </div>
  )
}

export default App
