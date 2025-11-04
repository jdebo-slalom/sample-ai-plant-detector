# 🚀 Deployment Guide

This guide covers deploying the Plant Disease Detector to various hosting platforms.

## 📋 Pre-Deployment Checklist

- [ ] Application builds successfully (`npm run build`)
- [ ] All tests pass (`npm run lint`)
- [ ] Environment variables are configured
- [ ] AWS Bedrock access is working
- [ ] Production build tested locally (`npm run preview`)

## 🌐 Deployment Options

### 1. Netlify (Recommended)

#### Automatic Deployment
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variables in Site Settings → Environment Variables
7. Deploy!

#### Manual Deployment
```bash
# Build the project
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### 2. Vercel

#### Automatic Deployment
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel auto-detects Vite configuration
4. Add environment variables in Project Settings
5. Deploy automatically on every push

#### Manual Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
npm run build
vercel --prod
```

### 3. AWS S3 + CloudFront

#### Setup S3 Bucket
```bash
# Create S3 bucket
aws s3 mb s3://plant-detector-app-bucket

# Enable static website hosting
aws s3 website s3://plant-detector-app-bucket \
  --index-document index.html \
  --error-document index.html
```

#### Deploy to S3
```bash
# Build the project
npm run build

# Upload to S3
aws s3 sync dist/ s3://plant-detector-app-bucket --delete

# Make files public
aws s3api put-bucket-policy \
  --bucket plant-detector-app-bucket \
  --policy '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "PublicReadGetObject",
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::plant-detector-app-bucket/*"
      }
    ]
  }'
```

#### Setup CloudFront (Optional)
1. Go to CloudFront console
2. Create new distribution
3. Set origin to your S3 bucket
4. Configure custom error pages (404 → /index.html)
5. Enable compression
6. Deploy

### 4. GitHub Pages

#### Setup
1. Go to repository Settings → Pages
2. Select "GitHub Actions" as source
3. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_AWS_REGION: ${{ secrets.VITE_AWS_REGION }}
          VITE_AWS_ACCESS_KEY_ID: ${{ secrets.VITE_AWS_ACCESS_KEY_ID }}
          VITE_AWS_SECRET_ACCESS_KEY: ${{ secrets.VITE_AWS_SECRET_ACCESS_KEY }}
          VITE_BEDROCK_MODEL_ID: ${{ secrets.VITE_BEDROCK_MODEL_ID }}
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

4. Add secrets in repository Settings → Secrets and variables → Actions

## 🔐 Environment Variables Setup

### Netlify
1. Go to Site Settings → Environment Variables
2. Add each variable:
   - `VITE_AWS_REGION`
   - `VITE_AWS_ACCESS_KEY_ID`
   - `VITE_AWS_SECRET_ACCESS_KEY`
   - `VITE_AWS_SESSION_TOKEN` (if using temporary credentials)
   - `VITE_BEDROCK_MODEL_ID`

### Vercel
1. Go to Project Settings → Environment Variables
2. Add variables for Production, Preview, and Development
3. Redeploy after adding variables

### AWS S3/CloudFront
Environment variables are built into the static files, so they must be set during build:
```bash
export VITE_AWS_REGION=us-east-1
export VITE_AWS_ACCESS_KEY_ID=your-key
export VITE_AWS_SECRET_ACCESS_KEY=your-secret
export VITE_BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
npm run build
```

## 🔧 Custom Domain Setup

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records as instructed
4. SSL certificate is automatically provisioned

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records
4. SSL is automatically handled

### AWS CloudFront
1. Request SSL certificate in AWS Certificate Manager
2. Add custom domain to CloudFront distribution
3. Update DNS records to point to CloudFront

## 🚨 Security Considerations

### Environment Variables
- **Never expose AWS credentials** in client-side code
- Use **temporary credentials** when possible
- Consider using **AWS Cognito** for user authentication
- Implement **rate limiting** to prevent abuse

### CORS Configuration
If using a custom backend, configure CORS properly:
```javascript
// Express.js example
app.use(cors({
  origin: ['https://your-domain.com', 'https://www.your-domain.com'],
  credentials: true
}))
```

### Content Security Policy
Add CSP headers for additional security:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               connect-src 'self' https://bedrock-runtime.*.amazonaws.com;
               img-src 'self' data: blob:;
               style-src 'self' 'unsafe-inline';">
```

## 📊 Performance Optimization

### Build Optimization
```javascript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          aws: ['@aws-sdk/client-bedrock-runtime'],
          mui: ['@mui/material', '@mui/icons-material']
        }
      }
    }
  }
})
```

### Image Optimization
- Compress images before upload
- Use WebP format when possible
- Implement client-side image resizing

### Caching
- Enable browser caching for static assets
- Use CDN for global distribution
- Implement service worker for offline support

## 🔍 Monitoring and Analytics

### Error Tracking
Consider adding error tracking:
```bash
npm install @sentry/react @sentry/tracing
```

### Analytics
Add analytics to track usage:
```bash
npm install @vercel/analytics
# or
npm install react-ga4
```

### Performance Monitoring
Monitor Core Web Vitals and user experience.

## 🧪 Testing Deployment

### Pre-deployment Tests
```bash
# Build and test locally
npm run build
npm run preview

# Test in different browsers
# Test on mobile devices
# Test with different image types
# Test error scenarios
```

### Post-deployment Tests
1. Visit deployed URL
2. Test image upload functionality
3. Verify AWS Bedrock integration works
4. Test responsive design
5. Check browser console for errors
6. Test with different image formats and sizes

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
        env:
          VITE_AWS_REGION: ${{ secrets.VITE_AWS_REGION }}
          VITE_AWS_ACCESS_KEY_ID: ${{ secrets.VITE_AWS_ACCESS_KEY_ID }}
          VITE_AWS_SECRET_ACCESS_KEY: ${{ secrets.VITE_AWS_SECRET_ACCESS_KEY }}
          VITE_BEDROCK_MODEL_ID: ${{ secrets.VITE_BEDROCK_MODEL_ID }}
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './dist'
          production-branch: main
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 📞 Troubleshooting Deployment

### Common Issues

#### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript errors
- Ensure environment variables are set

#### Runtime Errors
- Check browser console for errors
- Verify AWS credentials are correct
- Test API endpoints manually
- Check CORS configuration

#### Performance Issues
- Analyze bundle size with `npm run build`
- Check for unused dependencies
- Optimize images and assets
- Enable compression and caching

### Getting Help
- Check hosting platform documentation
- Review deployment logs
- Test locally with production build
- Check AWS CloudWatch for API errors

---

## 🎉 Deployment Complete!

After successful deployment:
1. Test all functionality
2. Share the URL with users
3. Monitor performance and errors
4. Set up alerts for downtime
5. Plan for regular updates and maintenance

Your Plant Disease Detector is now live and ready to help users identify plant health issues! 🌱
