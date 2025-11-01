import type { AnalysisResult } from '../types';

interface AnalysisResultsProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const AnalysisResults = ({ result, onReset }: AnalysisResultsProps) => {
  const getSeverityColor = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'high': return '#d32f2f';
      case 'medium': return '#f57c00';
      case 'low': return '#388e3c';
      default: return '#1976d2';
    }
  };

  const getSeverityBg = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'high': return '#ffebee';
      case 'medium': return '#fff3e0';
      case 'low': return '#e8f5e9';
      default: return '#e3f2fd';
    }
  };

  return (
    <div>
      <div style={{ 
        padding: 'clamp(16px, 3vw, 28px)', 
        backgroundColor: '#ffffff', 
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #e8e8e8'
      }}>
        <h2 style={{ 
          marginTop: 0, 
          marginBottom: '24px', 
          color: '#2c3e50',
          fontSize: 'clamp(20px, 3vw, 26px)',
          fontWeight: '700'
        }}>
          🔬 Analysis Results
        </h2>
        
        <div style={{ 
          marginBottom: '24px',
          padding: 'clamp(14px, 2.5vw, 20px)',
          backgroundColor: getSeverityBg(result.severity),
          borderRadius: '12px',
          borderLeft: `5px solid ${getSeverityColor(result.severity)}`,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ 
            fontSize: 'clamp(12px, 1.8vw, 14px)', 
            color: '#666', 
            marginBottom: '6px',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Diagnosis
          </div>
          <div style={{ 
            fontSize: 'clamp(18px, 3vw, 24px)', 
            fontWeight: 'bold', 
            color: '#2c3e50',
            lineHeight: '1.3'
          }}>
            {result.disease || 'Healthy Plant'}
          </div>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
          gap: 'clamp(12px, 3vw, 16px)', 
          marginBottom: 'clamp(20px, 4vw, 28px)' 
        }}>
          {result.severity && (
            <div style={{ 
              padding: 'clamp(12px, 2vw, 16px)', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '10px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ 
                fontSize: 'clamp(11px, 1.5vw, 12px)', 
                color: '#6c757d', 
                marginBottom: '6px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Severity
              </div>
              <div style={{ 
                fontSize: 'clamp(16px, 2.5vw, 20px)', 
                fontWeight: 'bold', 
                color: getSeverityColor(result.severity)
              }}>
                {result.severity}
              </div>
            </div>
          )}

          {result.confidence !== undefined && (
            <div style={{ 
              padding: 'clamp(12px, 2vw, 16px)', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '10px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ 
                fontSize: 'clamp(11px, 1.5vw, 12px)', 
                color: '#6c757d', 
                marginBottom: '6px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Confidence
              </div>
              <div style={{ 
                fontSize: 'clamp(16px, 2.5vw, 20px)', 
                fontWeight: 'bold', 
                color: '#2c3e50' 
              }}>
                {result.confidence}%
              </div>
            </div>
          )}
        </div>

        {result.recommendations && result.recommendations.length > 0 && (
          <div style={{
            padding: 'clamp(14px, 2.5vw, 20px)',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ 
              fontSize: 'clamp(15px, 2.2vw, 18px)', 
              marginTop: 0,
              marginBottom: '16px', 
              color: '#2c3e50',
              fontWeight: '700'
            }}>
              💊 Treatment Recommendations
            </h3>
            <ol style={{ 
              margin: 0, 
              paddingLeft: 'clamp(18px, 3vw, 24px)', 
              lineHeight: '1.7' 
            }}>
              {result.recommendations.map((rec, idx) => (
                <li key={idx} style={{ 
                  marginBottom: '14px', 
                  color: '#495057',
                  fontSize: 'clamp(13px, 2vw, 15px)'
                }}>
                  {rec}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <button
        onClick={onReset}
        style={{
          marginTop: '20px',
          padding: 'clamp(12px, 2vw, 16px) clamp(20px, 3vw, 28px)',
          fontSize: 'clamp(14px, 2vw, 16px)',
          backgroundColor: '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          width: '100%',
          fontWeight: '600',
          transition: 'all 0.2s',
          boxShadow: '0 4px 6px rgba(33, 150, 243, 0.3)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#1976d2';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(33, 150, 243, 0.4)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#2196f3';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(33, 150, 243, 0.3)';
        }}
      >
        🔄 Analyze Another Plant
      </button>
    </div>
  );
};
