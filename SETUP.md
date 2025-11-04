# 🔧 Plant Disease Detector - Setup Guide

This guide provides detailed instructions for setting up the Plant Disease Detector application, including AWS account configuration and troubleshooting.

## 📋 Prerequisites

### System Requirements
- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Git**: For version control
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge

### AWS Requirements
- **AWS Account**: Active AWS account with billing enabled
- **AWS CLI** (optional): For easier credential management
- **Bedrock Access**: Access to AWS Bedrock service in your region

## 🚀 Step-by-Step Setup

### 1. AWS Account Setup

#### Create AWS Account
1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click "Create an AWS Account"
3. Follow the registration process
4. Verify your email and phone number
5. Add a payment method (required for Bedrock access)

#### Enable AWS Bedrock
1. Sign in to AWS Console
2. Navigate to **AWS Bedrock** service
3. Select your preferred region (us-east-1 recommended)
4. Go to **Model Access** in the left sidebar
5. Click **Request model access**
6. Find **Anthropic Claude 3 Sonnet** and click **Request access**
7. Fill out the use case form (select "Experimentation" for testing)
8. Submit the request
9. Wait for approval (usually 5-15 minutes)

### 2. IAM User and Permissions

#### Create IAM User
1. Go to **IAM** service in AWS Console
2. Click **Users** → **Create user**
3. Enter username: `plant-detector-user`
4. Select **Programmatic access**
5. Click **Next**

#### Attach Permissions
1. Click **Attach policies directly**
2. Create a custom policy with this JSON:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": [
        "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0"
      ]
    }
  ]
}
```

3. Name the policy: `PlantDetectorBedrockAccess`
4. Attach the policy to your user
5. Complete user creation

#### Get Access Keys
1. Go to the created user
2. Click **Security credentials** tab
3. Click **Create access key**
4. Select **Application running outside AWS**
5. Add description: "Plant Disease Detector App"
6. **Save the Access Key ID and Secret Access Key** (you won't see them again!)

### 3. Project Setup

#### Clone and Install
```bash
# Clone the repository
git clone <repository-url>
cd plant-disease-detector

# Install dependencies
npm install
```

#### Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Edit with your credentials
nano .env.local  # or use your preferred editor
```

Add your AWS credentials to `.env.local`:
```env
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=AKIA...your-access-key
VITE_AWS_SECRET_ACCESS_KEY=your-secret-access-key
VITE_AWS_SESSION_TOKEN=  # Leave empty for permanent credentials
VITE_BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
```

#### Test the Setup
```bash
# Start development server
npm run dev

# Open browser to http://localhost:5173
# Try uploading a plant image to test the connection
```

## 🔐 Security Best Practices

### Credential Management
- **Never commit** `.env.local` to version control
- Use **temporary credentials** when possible
- **Rotate access keys** regularly
- Consider using **AWS IAM roles** for production

### Minimal Permissions
The IAM policy provided gives minimal required permissions:
- Only Bedrock model invocation
- Only for Claude 3 Sonnet model
- No other AWS services accessible

### Environment Variables
- Keep `.env.local` file secure
- Use different credentials for development/production
- Consider using AWS Secrets Manager for production

## 🌍 Regional Considerations

### Supported Regions
Claude 3 Sonnet is available in these regions:
- `us-east-1` (N. Virginia) - **Recommended**
- `us-west-2` (Oregon)
- `eu-west-1` (Ireland)
- `ap-southeast-1` (Singapore)

### Region Selection
1. Choose region closest to your users
2. Verify Claude 3 Sonnet availability
3. Update `VITE_AWS_REGION` in `.env.local`
4. Request model access in the chosen region

## 🔧 Troubleshooting

### Common Issues

#### "Access Denied" Errors
**Symptoms**: 403 errors when analyzing images
**Solutions**:
1. Verify AWS credentials are correct
2. Check IAM policy is attached to user
3. Ensure Bedrock model access is approved
4. Confirm you're using the correct region

#### "Model Not Found" Errors
**Symptoms**: Model ID not recognized
**Solutions**:
1. Verify model access is approved in AWS Console
2. Check the model ID in `.env.local`
3. Ensure you're in a supported region
4. Wait a few minutes after approval

#### "Invalid Credentials" Errors
**Symptoms**: Authentication failures
**Solutions**:
1. Regenerate access keys in IAM
2. Check for typos in `.env.local`
3. Ensure no extra spaces in credential values
4. Verify the user has programmatic access

#### Build/Development Issues
**Symptoms**: TypeScript or build errors
**Solutions**:
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript compilation
npx tsc --noEmit

# Run linting
npm run lint
```

### Testing Your Setup

#### 1. Credential Test
Create a simple test file to verify AWS connection:
```javascript
// test-aws.js
import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'your-key',
    secretAccessKey: 'your-secret'
  }
})

console.log('AWS client created successfully')
```

#### 2. Model Access Test
1. Go to AWS Bedrock Console
2. Navigate to **Playgrounds** → **Chat**
3. Select **Claude 3 Sonnet**
4. Send a test message
5. Verify you get a response

#### 3. Application Test
1. Start the development server
2. Upload a plant image (JPEG/PNG/WebP)
3. Click "Analyze Plant"
4. Verify you get analysis results

## 📊 Cost Considerations

### Bedrock Pricing
- **Claude 3 Sonnet**: ~$3 per 1M input tokens, ~$15 per 1M output tokens
- **Typical image analysis**: ~$0.01-0.05 per image
- **Free tier**: Not available for Bedrock

### Cost Optimization
- Use smaller images when possible
- Implement client-side image compression
- Add usage limits in production
- Monitor costs in AWS Billing Dashboard

## 🚀 Production Deployment

### Environment Variables
For production, set environment variables in your hosting platform:
- **Netlify**: Site settings → Environment variables
- **Vercel**: Project settings → Environment Variables
- **AWS Amplify**: App settings → Environment variables

### Security Considerations
- Use IAM roles instead of access keys when possible
- Implement rate limiting
- Add CORS restrictions
- Use HTTPS only
- Consider using AWS Cognito for user authentication

### Monitoring
- Enable AWS CloudTrail for API logging
- Set up CloudWatch alarms for cost monitoring
- Monitor Bedrock usage in AWS Console

## 📞 Getting Help

### AWS Support
- **AWS Documentation**: [docs.aws.amazon.com](https://docs.aws.amazon.com)
- **Bedrock User Guide**: Search for "Amazon Bedrock User Guide"
- **AWS Support**: Available through AWS Console

### Application Support
- Check the main README.md for common issues
- Review GitHub issues for similar problems
- Create a new issue with detailed error messages

### Community Resources
- **AWS Community Forums**: [forums.aws.amazon.com](https://forums.aws.amazon.com)
- **Stack Overflow**: Tag questions with `aws-bedrock`
- **AWS Reddit**: [r/aws](https://reddit.com/r/aws)

---

## 📝 Quick Reference

### Essential Commands
```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Run tests
npm run lint

# Check TypeScript
npx tsc --noEmit
```

### Important Files
- `.env.local` - Your AWS credentials (never commit!)
- `.env.example` - Template for environment variables
- `src/services/bedrockService.ts` - AWS integration
- `src/vite-env.d.ts` - TypeScript environment types

### AWS Console Links
- [Bedrock Console](https://console.aws.amazon.com/bedrock/)
- [IAM Console](https://console.aws.amazon.com/iam/)
- [Billing Dashboard](https://console.aws.amazon.com/billing/)

---

**Need more help?** Create an issue in the GitHub repository with:
- Your error message
- Steps you've tried
- Your environment (OS, Node version, etc.)
- AWS region you're using
