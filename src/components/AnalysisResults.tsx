import type { AnalysisResult } from '../types'

interface AnalysisResultsProps {
  result: AnalysisResult
  onReset: () => void
}

function getSeverityColor(severity?: string): string {
  switch (severity?.toLowerCase()) {
    case 'high':
      return '#d32f2f'
    case 'medium':
      return '#f57c00'
    case 'low':
      return '#388e3c'
    default:
      return '#1976d2'
  }
}

export const AnalysisResults = ({ result, onReset }: AnalysisResultsProps) => {
  return (
    <div style={{
      border: '2px solid #e0e0e0',
      borderRadius: 'clamp(8px, 1vw, 12px)',
      padding: 'clamp(20px, 4vw, 32px)',
      backgroundColor: '#fafafa',
      textAlign: 'left',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: 'clamp(16px, 3vw, 24px)',
        fontSize: 'clamp(48px, 8vw, 64px)',
      }}>
        🔬
        <h2 style={{
          margin: '0 0 0 clamp(12px, 2vw, 16px)',
          fontSize: 'clamp(20px, 4vw, 28px)',
          color: '#333',
        }}>
          Analysis Results
        </h2>
      </div>

      {result.disease && (
        <div style={{ marginBottom: 'clamp(16px, 3vw, 20px)' }}>
          <h3 style={{
            margin: '0 0 clamp(8px, 2vw, 12px) 0',
            fontSize: 'clamp(16px, 3vw, 18px)',
            color: '#555',
          }}>
            Condition
          </h3>
          <div style={{
            fontSize: 'clamp(18px, 3.5vw, 22px)',
            fontWeight: 'bold',
            color: getSeverityColor(result.severity),
          }}>
            {result.disease}
          </div>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 'clamp(12px, 2vw, 16px)',
        marginBottom: 'clamp(16px, 3vw, 20px)',
      }}>
        {result.severity && (
          <div>
            <h4 style={{
              margin: '0 0 clamp(4px, 1vw, 8px) 0',
              fontSize: 'clamp(14px, 2.5vw, 16px)',
              color: '#555',
            }}>
              Severity
            </h4>
            <div style={{
              fontSize: 'clamp(16px, 3vw, 18px)',
              fontWeight: 'bold',
              color: getSeverityColor(result.severity),
            }}>
              {result.severity}
            </div>
          </div>
        )}

        {result.confidence !== undefined && (
          <div>
            <h4 style={{
              margin: '0 0 clamp(4px, 1vw, 8px) 0',
              fontSize: 'clamp(14px, 2.5vw, 16px)',
              color: '#555',
            }}>
              Confidence
            </h4>
            <div style={{
              fontSize: 'clamp(16px, 3vw, 18px)',
              fontWeight: 'bold',
              color: '#1976d2',
            }}>
              {result.confidence}%
            </div>
          </div>
        )}
      </div>

      {result.recommendations && result.recommendations.length > 0 && (
        <div style={{ marginBottom: 'clamp(20px, 4vw, 24px)' }}>
          <h3 style={{
            margin: '0 0 clamp(12px, 2vw, 16px) 0',
            fontSize: 'clamp(16px, 3vw, 18px)',
            color: '#555',
          }}>
            Recommendations
          </h3>
          <ul style={{
            margin: 0,
            paddingLeft: 'clamp(16px, 3vw, 20px)',
            fontSize: 'clamp(14px, 2.5vw, 16px)',
            lineHeight: 1.6,
            color: '#666',
          }}>
            {result.recommendations.map((recommendation, index) => (
              <li key={index} style={{ marginBottom: 'clamp(8px, 2vw, 12px)' }}>
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onReset}
        style={{
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: 'clamp(4px, 1vw, 6px)',
          padding: 'clamp(12px, 2vw, 16px) clamp(24px, 4vw, 32px)',
          fontSize: 'clamp(14px, 2.5vw, 16px)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontWeight: 500,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1565c0'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#1976d2'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        Analyze Another Image
      </button>
    </div>
  )
}
