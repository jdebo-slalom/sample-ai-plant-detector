# Setup Instructions

## Prerequisites
- Node.js 18+ installed
- AWS account with Bedrock access
- IAM user with Bedrock permissions

## AWS Setup

1. **Enable Bedrock Model Access**
   - Go to AWS Console → Bedrock → Model access
   - Request access to "Claude 3 Sonnet" model
   - Wait for approval (usually instant)

2. **Create IAM User**
   - Go to IAM → Users → Create user
   - Attach policy: `AmazonBedrockFullAccess`
   - Create access key → Save credentials

3. **Configure Environment**
   - Copy `.env.local` and add your credentials:
   ```
   VITE_AWS_REGION=us-east-1
   VITE_AWS_ACCESS_KEY_ID=your_actual_key
   VITE_AWS_SECRET_ACCESS_KEY=your_actual_secret
   VITE_BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
   ```

## Installation

```bash
npm install
npm run dev
```

## Usage

1. Open http://localhost:5173
2. Upload a plant image (drag & drop or click)
3. Click "Analyze Plant"
4. View results and recommendations

## Troubleshooting

- **Black screen**: Run `npm run build` to check for errors
- **Analysis fails**: Verify AWS credentials and Bedrock model access
- **CORS errors**: Ensure IAM permissions are correct
