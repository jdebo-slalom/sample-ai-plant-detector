import { useState } from 'react'
import type { AnalysisResult } from './types'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  // Test environment variable access
  console.log('AWS Region:', import.meta.env.VITE_AWS_REGION)

  return (
    <>
      <div>
        <h1>Plant Disease Detector</h1>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
