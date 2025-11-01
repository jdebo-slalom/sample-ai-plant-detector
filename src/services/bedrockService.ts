import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import type { AnalysisResult } from '../types';

const client = new BedrockRuntimeClient({
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  },
});

const MODEL_ID = import.meta.env.VITE_BEDROCK_MODEL_ID || 'anthropic.claude-3-sonnet-20240229-v1:0';

export const analyzePlantImage = async (base64Image: string): Promise<AnalysisResult> => {
  const imageData = base64Image.split(',')[1];

  const payload = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: imageData,
            },
          },
          {
            type: 'text',
            text: `Analyze this plant image for diseases, pests, or health issues. Provide:
1. Disease/pest name (if any)
2. Severity (Low/Medium/High)
3. Confidence level (0-100%)
4. Treatment recommendations (3-5 specific steps)

Format as JSON: {"disease": "name or none", "severity": "level", "confidence": number, "recommendations": ["step1", "step2", ...]}`
          },
        ],
      },
    ],
  };

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(payload),
  });

  const response = await client.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  
  const textContent = responseBody.content.find((c: { type: string }) => c.type === 'text')?.text || '';
  const jsonMatch = textContent.match(/\{[\s\S]*\}/);
  const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

  return {
    disease: result.disease,
    severity: result.severity,
    confidence: result.confidence,
    recommendations: result.recommendations || [],
  };
};
