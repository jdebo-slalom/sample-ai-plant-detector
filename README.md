# 🌱 Plant Disease Detector

An AI-powered web application that analyzes plant images to detect diseases, pests, and health issues using AWS Bedrock and Claude 3 Sonnet.

![Plant Disease Detector](https://img.shields.io/badge/React-18.3.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue) ![Vite](https://img.shields.io/badge/Vite-5.4.1-purple) ![AWS Bedrock](https://img.shields.io/badge/AWS-Bedrock-orange)

## ✨ Features

- **🔍 AI-Powered Analysis**: Uses Claude 3 Sonnet via AWS Bedrock for accurate plant disease detection
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🖱️ Drag & Drop Upload**: Intuitive image upload with drag-and-drop support
- **⚡ Real-time Processing**: Fast image analysis with loading states and progress indicators
- **🎨 Modern UI**: Clean, accessible interface with Material-UI icons
- **🔒 Type-Safe**: Built with TypeScript for enhanced developer experience
- **📊 Detailed Results**: Provides disease identification, severity assessment, and treatment recommendations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- AWS Account with Bedrock access
- Claude 3 Sonnet model access in AWS Bedrock

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd plant-disease-detector
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your AWS credentials:
   ```env
   VITE_AWS_REGION=us-east-1
   VITE_AWS_ACCESS_KEY_ID=your_access_key_here
   VITE_AWS_SECRET_ACCESS_KEY=your_secret_key_here
   VITE_AWS_SESSION_TOKEN=your_session_token_here
   VITE_BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### AWS Setup

1. **Enable Bedrock Access**
   - Go to AWS Bedrock console
   - Request access to Claude 3 Sonnet model
   - Wait for approval (usually takes a few minutes)

2. **IAM Permissions**
   Your AWS user/role needs these permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "bedrock:InvokeModel"
         ],
         "Resource": "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0"
       }
     ]
   }
   ```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_AWS_REGION` | AWS region (e.g., us-east-1) | Yes |
| `VITE_AWS_ACCESS_KEY_ID` | AWS access key ID | Yes |
| `VITE_AWS_SECRET_ACCESS_KEY` | AWS secret access key | Yes |
| `VITE_AWS_SESSION_TOKEN` | AWS session token (for temporary credentials) | No |
| `VITE_BEDROCK_MODEL_ID` | Bedrock model identifier | Yes |

## 📖 Usage

1. **Upload Image**: Drag and drop a plant image or click to select from your device
2. **Supported Formats**: JPEG, PNG, WebP (max 5MB)
3. **Analyze**: Click the "Analyze Plant" button to start AI analysis
4. **View Results**: Get detailed information about:
   - Disease/condition identification
   - Severity level (Low/Medium/High)
   - Confidence percentage
   - Treatment recommendations
5. **Reset**: Click "Analyze Another Image" to start over

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ImageUpload.tsx     # Drag-and-drop image upload
│   ├── ImagePreview.tsx    # Image preview with metadata
│   └── AnalysisResults.tsx # AI analysis results display
├── services/           # External service integrations
│   └── bedrockService.ts   # AWS Bedrock API client
├── types/              # TypeScript type definitions
│   └── index.ts           # Core application types
├── utils/              # Utility functions
│   └── imageUtils.ts      # Image validation and processing
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── vite-env.d.ts       # Vite environment types
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run prepare` - Set up Husky git hooks

### Code Quality

- **ESLint**: Configured with TypeScript and React rules
- **Husky**: Pre-commit hooks for linting and type checking
- **TypeScript**: Strict mode enabled for type safety
- **Prettier**: Code formatting (via ESLint integration)

### Testing Checklist

- [ ] Upload valid image files (JPEG, PNG, WebP)
- [ ] Test file size validation (>5MB should fail)
- [ ] Test invalid file types (PDF, GIF should fail)
- [ ] Verify drag-and-drop functionality
- [ ] Test responsive design on different screen sizes
- [ ] Verify error handling with invalid AWS credentials
- [ ] Test analysis with healthy plant images
- [ ] Test analysis with diseased plant images

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deployment Options

1. **AWS S3 + CloudFront**
   - Upload `dist/` contents to S3 bucket
   - Configure CloudFront distribution
   - Set environment variables in build process

2. **Netlify**
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Configure environment variables in Netlify dashboard

3. **Vercel**
   - Import project from GitHub
   - Framework preset: Vite
   - Configure environment variables in Vercel dashboard

## 🔍 Troubleshooting

### Common Issues

**"Property 'env' does not exist on type 'ImportMeta'"**
- Ensure `src/vite-env.d.ts` exists with proper type definitions

**"Access denied" errors from AWS Bedrock**
- Verify AWS credentials are correct
- Check IAM permissions for Bedrock access
- Ensure Claude 3 Sonnet model access is approved

**Build fails with TypeScript errors**
- Run `npm run lint` to identify issues
- Check all imports and type definitions

**Images not uploading**
- Verify file size is under 5MB
- Check file format (JPEG, PNG, WebP only)
- Ensure drag-and-drop events are not blocked

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review AWS Bedrock documentation

---

Built with ❤️ using React, TypeScript, Vite, and AWS Bedrock
