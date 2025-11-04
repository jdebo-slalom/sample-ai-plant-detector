import { useState } from 'react'
import type { AnalysisResult } from './types'
import { fileToBase64 } from './utils/imageUtils'
import { analyzePlantImage } from './services/bedrockService'
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
        {/* Placeholder for components - will be added in Step 12 */}
        <div style={{
          padding: 'clamp(20px, 4vw, 32px)',
          border: '2px dashed #ccc',
          borderRadius: 'clamp(8px, 2vw, 12px)',
          textAlign: 'center',
          color: '#666',
        }}>
          <p>Components will be wired here in Step 12</p>
          <p>Current state:</p>
          <ul style={{ textAlign: 'left', display: 'inline-block' }}>
            <li>Image: {image ? '✅ Loaded' : '❌ None'}</li>
            <li>Loading: {isLoading ? '⏳ Yes' : '✅ No'}</li>
            <li>Result: {result ? '✅ Available' : '❌ None'}</li>
            <li>Error: {error ? `❌ ${error}` : '✅ None'}</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

export default App
