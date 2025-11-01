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
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f7fa',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        padding: '20px 0'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(24px, 5vw, 48px)' }}>
          <h1 style={{ 
            fontSize: 'clamp(24px, 6vw, 42px)', 
            fontWeight: 'bold', 
            color: '#2c3e50',
            marginBottom: '12px',
            letterSpacing: '-0.5px',
            lineHeight: '1.2',
            wordBreak: 'break-word'
          }}>
            🌱 Plant Disease Detector
          </h1>
          <p style={{ 
            color: '#7f8c8d', 
            fontSize: 'clamp(13px, 3vw, 18px)', 
            margin: 0,
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.5',
            padding: '0 10px'
          }}>
            Upload a plant image for AI-powered disease analysis
          </p>
        </div>
      
        <div style={{
          display: 'grid',
          gridTemplateColumns: image && result ? 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))' : '1fr',
          gap: '24px',
          alignItems: 'start'
        }}>
          {!image ? (
            <div style={{ gridColumn: '1 / -1' }}>
              <ImageUpload onImageSelect={handleImageSelect} />
            </div>
          ) : (
            <>
              <div>
                <ImagePreview image={image} onRemove={handleRemoveImage} />
                
                {!result && (
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    style={{
                      marginTop: '20px',
                      padding: '16px 24px',
                      fontSize: '16px',
                      fontWeight: '600',
                      backgroundColor: isAnalyzing ? '#bdbdbd' : '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                      width: '100%',
                      transition: 'all 0.2s',
                      boxShadow: isAnalyzing ? 'none' : '0 4px 6px rgba(76, 175, 80, 0.3)',
                      transform: isAnalyzing ? 'none' : 'translateY(0)'
                    }}
                    onMouseOver={(e) => {
                      if (!isAnalyzing) {
                        e.currentTarget.style.backgroundColor = '#45a049';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(76, 175, 80, 0.4)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isAnalyzing) {
                        e.currentTarget.style.backgroundColor = '#4CAF50';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(76, 175, 80, 0.3)';
                      }
                    }}
                  >
                    {isAnalyzing ? '🔍 Analyzing...' : '🔬 Analyze Plant'}
                  </button>
                )}

                {error && (
                  <div style={{ 
                    marginTop: '20px', 
                    padding: '16px', 
                    backgroundColor: '#ffebee', 
                    borderRadius: '10px', 
                    color: '#c62828',
                    border: '1px solid #ef9a9a',
                    fontSize: '14px'
                  }}>
                    <strong>⚠️ Error:</strong> {error}
                  </div>
                )}
              </div>

              {result && (
                <div>
                  <AnalysisResults result={result} onReset={handleReset} />
                </div>
              )}
            </>
          )}
        </div>
        <footer style={{
          marginTop: 'clamp(32px, 8vw, 64px)',
          paddingTop: 'clamp(16px, 3vw, 24px)',
          borderTop: '1px solid #e0e0e0',
          textAlign: 'center',
          color: '#95a5a6',
          fontSize: 'clamp(12px, 2vw, 14px)'
        }}>
          <p style={{ margin: 0, padding: '0 10px' }}>Powered by Amazon Bedrock & Claude 3 Sonnet</p>
        </footer>
      </div>
    </div>
  )
}

export default App
