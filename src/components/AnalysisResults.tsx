import type { AnalysisResult } from '../types';

interface AnalysisResultsProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const AnalysisResults = ({ result, onReset }: AnalysisResultsProps) => {
  const getSeverityColor = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#2196f3';
    }
  };

  return (
    <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <h2 style={{ marginTop: 0 }}>Analysis Results</h2>
      
      <div style={{ marginBottom: '16px' }}>
        <strong>Diagnosis:</strong> {result.disease || 'Healthy plant'}
      </div>

      {result.severity && (
        <div style={{ marginBottom: '16px' }}>
          <strong>Severity:</strong>{' '}
          <span style={{ color: getSeverityColor(result.severity), fontWeight: 'bold' }}>
            {result.severity}
          </span>
        </div>
      )}

      {result.confidence !== undefined && (
        <div style={{ marginBottom: '16px' }}>
          <strong>Confidence:</strong> {result.confidence}%
        </div>
      )}

      {result.recommendations && result.recommendations.length > 0 && (
        <div>
          <strong>Recommendations:</strong>
          <ol style={{ marginTop: '8px', paddingLeft: '20px' }}>
            {result.recommendations.map((rec, idx) => (
              <li key={idx} style={{ marginBottom: '8px' }}>{rec}</li>
            ))}
          </ol>
        </div>
      )}

      <button
        onClick={onReset}
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        Analyze Another Plant
      </button>
    </div>
  );
};
