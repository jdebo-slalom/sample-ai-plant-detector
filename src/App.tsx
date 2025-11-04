import { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import LoopIcon from '@mui/icons-material/Loop'
import type { AnalysisResult } from './types'
import { fileToBase64 } from './utils/imageUtils'
import { analyzePlantImage } from './services/bedrockService'
import { ImageUpload } from './components/ImageUpload'
import { ImagePreview } from './components/ImagePreview'
import { AnalysisResults } from './components/AnalysisResults'
import './App.css'

function App() {
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageSelect = async (file: File) => {
    try {
      const base64 = await fileToBase64(file)
      setImage(base64)
      setImageFile(file)
      setResult(null)
      setError(null)
      console.log('Image selected:', file.name)
    } catch (err) {
      setError('Failed to process image')
      console.error('Image processing error:', err)
    }
  }

  const handleAnalyze = async () => {
    if (!image) return

    try {
      setIsLoading(true)
      setError(null)
      console.log('Starting analysis...')
      
      const analysisResult = await analyzePlantImage(image)
      setResult(analysisResult)
      console.log('Analysis completed:', analysisResult)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze image'
      setError(errorMessage)
      console.error('Analysis error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setImage(null)
    setImageFile(null)
    setResult(null)
    setError(null)
    setIsLoading(false)
    console.log('App reset')
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: 'clamp(16px, 4vw, 32px)',
      fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    }}>
      <header style={{
        textAlign: 'center',
        marginBottom: 'clamp(32px, 6vw, 48px)',
      }}>
        <h1 style={{
          fontSize: 'clamp(28px, 6vw, 42px)',
          margin: '0 0 clamp(8px, 2vw, 16px) 0',
          color: '#333',
        }}>
          🌱 Plant Disease Detector
        </h1>
        <p style={{
          fontSize: 'clamp(14px, 3vw, 18px)',
          color: '#666',
          margin: 0,
        }}>
          Upload a plant image to detect diseases and get treatment recommendations
        </p>
      </header>

      <main>
        {/* Step 1: Image Upload or Preview */}
        <div style={{ marginBottom: 'clamp(24px, 4vw, 32px)' }}>
          {!image ? (
            <ImageUpload onImageSelect={handleImageSelect} />
          ) : (
            <ImagePreview
              imageUrl={image}
              fileName={imageFile?.name || 'Unknown'}
              fileSize={imageFile?.size || 0}
              onRemove={handleReset}
            />
          )}
        </div>

        {/* Step 2: Analyze Button */}
        {image && !result && (
          <div style={{ textAlign: 'center', marginBottom: 'clamp(24px, 4vw, 32px)' }}>
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              style={{
                backgroundColor: isLoading ? '#ccc' : '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: 'clamp(6px, 1vw, 8px)',
                padding: 'clamp(12px, 3vw, 16px) clamp(24px, 5vw, 32px)',
                fontSize: 'clamp(16px, 3vw, 18px)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(6px, 1vw, 8px)',
                margin: '0 auto',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#45a049'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#4caf50'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              {isLoading ? (
                <>
                  <LoopIcon style={{ fontSize: 'clamp(16px, 3vw, 18px)' }} />
                  Analyzing Plant...
                </>
              ) : (
                <>
                  <SearchIcon style={{ fontSize: 'clamp(16px, 3vw, 18px)' }} />
                  Analyze Plant
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 3: Loading State */}
        {isLoading && (
          <div style={{
            textAlign: 'center',
            padding: 'clamp(20px, 4vw, 32px)',
            backgroundColor: '#f0f8ff',
            borderRadius: 'clamp(8px, 2vw, 12px)',
            marginBottom: 'clamp(24px, 4vw, 32px)',
          }}>
            <LoopIcon style={{
              fontSize: 'clamp(32px, 6vw, 48px)',
              color: '#1976d2',
              marginBottom: 'clamp(12px, 2vw, 16px)',
              animation: 'spin 2s linear infinite',
            }} />
            <p style={{
              fontSize: 'clamp(16px, 3vw, 18px)',
              color: '#1976d2',
              margin: 0,
            }}>
              Analyzing your plant image with AI...
            </p>
          </div>
        )}

        {/* Step 4: Analysis Results */}
        {result && (
          <AnalysisResults result={result} onReset={handleReset} />
        )}

        {/* Step 5: Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: 'clamp(16px, 3vw, 20px)',
            borderRadius: 'clamp(6px, 1vw, 8px)',
            marginBottom: 'clamp(24px, 4vw, 32px)',
            textAlign: 'center',
            fontSize: 'clamp(14px, 2.5vw, 16px)',
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default App
