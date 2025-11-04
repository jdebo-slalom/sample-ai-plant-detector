import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import type { AnalysisResult } from '../types'

function getClientConfig() {
  return {
    region: import.meta.env.VITE_AWS_REGION,
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN,
    },
  }
}

const client = new BedrockRuntimeClient(getClientConfig())

export async function analyzePlantImage(base64Image: string): Promise<AnalysisResult> {
  try {
    // Extract base64 data from data URL
    const base64Data = base64Image.split(',')[1]
    
    console.log('🔵 Request: Calling Bedrock API for plant analysis')
    
    const payload = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: `Analyze this plant image for diseases, pests, or health issues. Respond with a JSON object containing:
              - disease: name of the disease/issue (if any)
              - severity: "Low", "Medium", or "High"
              - confidence: number between 0-100
              - recommendations: array of treatment suggestions
              
              If the plant appears healthy, set disease to "Healthy" and provide care recommendations.`,
            },
          ],
        },
      ],
    }

    const command = new InvokeModelCommand({
      modelId: import.meta.env.VITE_BEDROCK_MODEL_ID,
      body: JSON.stringify(payload),
      contentType: 'application/json',
    })

    const response = await client.send(command)
    const responseBody = JSON.parse(new TextDecoder().decode(response.body))
    
    console.log('🟢 Response: Received Bedrock response', responseBody)
    
    // Parse the response content
    const content = responseBody.content[0].text
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0])
      return result as AnalysisResult
    }
    
    // Fallback if JSON parsing fails
    return {
      disease: 'Analysis completed',
      severity: 'Medium',
      confidence: 50,
      recommendations: ['Unable to parse detailed analysis. Please try again.'],
    }
  } catch (error) {
    console.error('🔴 Error: Bedrock API call failed', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze image')
  }
}
