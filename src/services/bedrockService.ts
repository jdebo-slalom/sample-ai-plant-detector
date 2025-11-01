import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import type { AnalysisResult } from '../types';

const getClientConfig = () => {
  const region = import.meta.env.VITE_AWS_REGION || 'us-east-1';
  
  // If explicit credentials provided, use them
  if (import.meta.env.VITE_AWS_ACCESS_KEY_ID && import.meta.env.VITE_AWS_SECRET_ACCESS_KEY) {
    const credentials: {
      accessKeyId: string;
      secretAccessKey: string;
      sessionToken?: string;
    } = {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    };
    
    // Add session token if provided (for temporary credentials)
    if (import.meta.env.VITE_AWS_SESSION_TOKEN) {
      credentials.sessionToken = import.meta.env.VITE_AWS_SESSION_TOKEN;
    }
    
    return { region, credentials };
  }
  
  // Otherwise use default credential chain (won't work in browser)
  return { region };
};

const client = new BedrockRuntimeClient(getClientConfig());

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

  console.group('🔵 Bedrock Request');
  console.log('Model ID:', MODEL_ID);
  console.log('Region:', import.meta.env.VITE_AWS_REGION);
  console.log('Payload Size:', JSON.stringify(payload).length, 'bytes');
  console.log('Image Size:', imageData.length, 'bytes');
  console.log('Full Payload:', payload);
  console.groupEnd();

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(payload),
  });

  try {
    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    console.group('🟢 Bedrock Response');
    console.log('Full Response:', responseBody);
    console.groupEnd();
    
    const textContent = responseBody.content.find((c: { type: string }) => c.type === 'text')?.text || '';
    
    console.group('📝 Extracted Text');
    console.log(textContent);
    console.groupEnd();
    
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    
    console.group('✅ Parsed Result');
    console.log(result);
    console.groupEnd();

    return {
      disease: result.disease,
      severity: result.severity,
      confidence: result.confidence,
      recommendations: result.recommendations || [],
    };
  } catch (error) {
    console.group('🔴 Bedrock Error');
    console.error('Error Details:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }
    console.groupEnd();
    throw error;
  }
};
