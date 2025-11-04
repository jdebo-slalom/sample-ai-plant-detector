# Plant Disease Detector - Implementation Workflow

This document provides step-by-step instructions for building the Plant Disease Detector application from scratch. Each step is designed to be small, manageable, and independently testable.

**IMPORTANT**: This workflow is designed for non-interactive execution. Use only commands that do not require user input or confirmation prompts. Always use flags like `-y`, `--yes`, or provide all required arguments upfront.

---

## Getting Started

### Create Working Branch

Before starting implementation, create a feature branch:

```bash
git checkout -b feature/plant-disease-detector
```

### Workflow Pattern

After completing each step:
1. Test that the step works as expected
2. Stage your changes: `git add .`
3. Commit with descriptive message: `git commit -m "Step X: [description]"`
4. Push to remote: `git push origin feature/plant-disease-detector`
5. Move to next step

---

## Phase 1: Project Foundation

### Step 1: Initialize Project

**Goal**: Set up basic project structure and tooling

**Tasks**:
1. Create new Vite + React + TypeScript project: `npm create vite@latest plant-disease-detector -- --template react-ts`
2. Navigate to project: `cd plant-disease-detector`
3. Install dependencies: `npm install`
4. Start dev server: `npm run dev`
5. Verify application loads at http://localhost:5173

**Acceptance Criteria**:
- Dev server runs without errors
- Default Vite + React template displays in browser
- Hot module replacement (HMR) works

**Test**: Open browser and see default Vite React page

**Commit**: `git add . && git commit -m "Step 1: Initialize project with Vite + React + TypeScript" && git push origin feature/plant-disease-detector`

---

### Step 2: Configure TypeScript

**Goal**: Set up TypeScript configuration with strict mode

**Tasks**:
1. Update `tsconfig.json` with:
   - `"strict": true`
   - `"target": "ES2020"`
   - `"module": "ESNext"`
   - `"verbatimModuleSyntax": true`
   - `"jsx": "react-jsx"`
2. Create `tsconfig.app.json` for application-specific settings
3. Create `tsconfig.node.json` for Node.js environment (Vite config)

**Acceptance Criteria**:
- TypeScript compiles without errors
- Strict type checking is enforced
- No type errors in default template

**Test**: Run `npm run build` and verify no TypeScript errors

**Commit**: `git add . && git commit -m "Step 2: Configure TypeScript with strict mode" && git push origin feature/plant-disease-detector`

---

### Step 3: Add Code Quality Tools

**Goal**: Set up linting and git hooks for code quality

**Tasks**:
1. Install ESLint: `npm install -D eslint@9.36.0 typescript-eslint@8.45.0`
2. Install React plugins: `npm install -D eslint-plugin-react-hooks eslint-plugin-react-refresh`
3. Create `eslint.config.js` with TypeScript and React rules
4. Install git hooks: `npm install -D husky@9.1.7 lint-staged@16.2.6`
5. Add `"prepare": "husky install"` to package.json scripts
6. Run `npm run prepare`
7. Create `.husky/pre-commit` hook to run `eslint --fix` and `tsc --noEmit`
8. Add `"lint": "eslint ."` to package.json scripts

**Acceptance Criteria**:
- `npm run lint` runs successfully
- Pre-commit hook runs on git commit
- Linting errors prevent commits

**Test**: Make a commit and verify pre-commit hook runs

**Commit**: `git add . && git commit -m "Step 3: Add ESLint and Husky for code quality" && git push origin feature/plant-disease-detector`

---

## Phase 2: Type Definitions & Utilities

### Step 4: Define Core Types

**Goal**: Create TypeScript type definitions for the application

**Tasks**:
1. Create `src/types/index.ts`
2. Define `AnalysisResult` interface:
```typescript
export interface AnalysisResult {
  disease?: string
  severity?: string
  confidence?: number
  recommendations?: string[]
}
```
3. Export all types using named exports

**Acceptance Criteria**:
- Types file compiles without errors
- All properties use optional `?` syntax
- Types can be imported with `import type { AnalysisResult } from '../types'`

**Test**: Import the type in App.tsx and verify no errors

**Commit**: `git add . && git commit -m "Step 4: Define core TypeScript types" && git push origin feature/plant-disease-detector`

---

### Step 5: Build Image Utilities

**Goal**: Create utility functions for image validation and processing

**Tasks**:
1. Create `src/utils/imageUtils.ts`
2. Define constants:
```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
```
3. Implement `validateImage(file: File): string | null`:
   - Check if file type is in ALLOWED_TYPES
   - Check if file size is under MAX_FILE_SIZE
   - Return error string or null
4. Implement `fileToBase64(file: File): Promise<string>`:
   - Wrap FileReader in Promise
   - Use readAsDataURL method
   - Return base64 string

**Acceptance Criteria**:
- Functions have explicit type annotations
- Validation returns null on success, error string on failure
- Base64 conversion works with test images

**Test**: Create a test file and call these functions in console

**Commit**: `git add . && git commit -m "Step 5: Build image validation and base64 utilities" && git push origin feature/plant-disease-detector`

---

## Phase 3: AWS Bedrock Integration

### Step 6: Set Up Environment Variables

**Goal**: Configure environment variables for AWS credentials

**Tasks**:
1. Create `.env.example` with:
```
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=
VITE_AWS_SECRET_ACCESS_KEY=
VITE_AWS_SESSION_TOKEN=
VITE_BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
```
2. Create `.env.local` with your actual AWS credentials
3. Add `.env.local` to `.gitignore`
4. Document required AWS permissions in comments

**Acceptance Criteria**:
- `.env.example` is committed to repo
- `.env.local` is in `.gitignore`
- Variables accessible via `import.meta.env.VITE_*`

**Test**: Console.log an env variable in App.tsx

**Commit**: `git add . && git commit -m "Step 6: Set up environment variables for AWS" && git push origin feature/plant-disease-detector`

---

### Step 7: Build Bedrock Service

**Goal**: Implement AWS Bedrock integration for plant analysis

**Tasks**:
1. Install AWS SDK: `npm install @aws-sdk/client-bedrock-runtime@3.919.0`
2. Create `src/services/bedrockService.ts`
3. Implement `getClientConfig()` function:
   - Read AWS credentials from environment variables
   - Return config object with region and credentials
4. Create BedrockRuntimeClient instance
5. Implement `analyzePlantImage(base64Image: string): Promise<AnalysisResult>`:
   - Extract base64 data from data URL
   - Build Claude 3 Sonnet payload with vision prompt
   - Use InvokeModelCommand to call Bedrock
   - Parse JSON response from model
   - Add grouped console.log debugging (🔵 Request, 🟢 Response, 🔴 Error)
   - Return structured AnalysisResult
6. Test with hardcoded base64 image string

**Acceptance Criteria**:
- Service successfully calls Bedrock API
- Returns structured AnalysisResult
- Debug logs show request/response details
- Error handling with try-catch

**Test**: Call the function with a test base64 image and verify response

**Commit**: `git add . && git commit -m "Step 7: Implement AWS Bedrock service integration" && git push origin feature/plant-disease-detector`

---

## Phase 4: UI Components (Presentational)

### Step 8: Create ImageUpload Component

**Goal**: Build drag-and-drop image upload component

**Tasks**:
1. Create `src/components/ImageUpload.tsx`
2. Define `ImageUploadProps` interface with `onImageSelect: (file: File) => void`
3. Implement drag-and-drop handlers:
   - `onDragOver`: Prevent default and set drag state
   - `onDragLeave`: Clear drag state
   - `onDrop`: Get file, validate, call onImageSelect
4. Add hidden file input with click-to-upload
5. Call `validateImage` from imageUtils
6. Use inline styles with `clamp()` for responsive design
7. Add visual feedback for drag-over state
8. Use named export: `export const ImageUpload`

**Acceptance Criteria**:
- Drag-and-drop works for image files
- Click to upload works
- Invalid files show error
- Component is fully responsive
- No semicolons, single quotes

**Test**: Render component and test drag-and-drop and click upload

**Commit**: `git add . && git commit -m "Step 8: Create ImageUpload component with drag-and-drop" && git push origin feature/plant-disease-detector`

---

### Step 9: Create ImagePreview Component

**Goal**: Build component to display uploaded image

**Tasks**:
1. Create `src/components/ImagePreview.tsx`
2. Define `ImagePreviewProps` interface:
   - `imageUrl: string`
   - `fileName: string`
   - `fileSize: number`
   - `onRemove: () => void`
3. Display image with proper sizing (max-width, object-fit)
4. Show filename and formatted file size (KB/MB)
5. Add remove button with callback
6. Use inline styles with `clamp()`
7. Use named export

**Acceptance Criteria**:
- Image displays correctly
- Remove button triggers callback
- File info displays below image
- Responsive on all screen sizes

**Test**: Pass test data and verify rendering

**Commit**: `git add . && git commit -m "Step 9: Create ImagePreview component" && git push origin feature/plant-disease-detector`

---

### Step 10: Create AnalysisResults Component

**Goal**: Build component to display AI analysis results

**Tasks**:
1. Create `src/components/AnalysisResults.tsx`
2. Define `AnalysisResultsProps` interface with `result: AnalysisResult`, `onReset: () => void`
3. Implement `getSeverityColor(severity?: string)` function:
   - High: `#d32f2f` (red)
   - Medium: `#f57c00` (orange)
   - Low: `#388e3c` (green)
   - Default: `#1976d2` (blue)
4. Display disease name, confidence, severity with color coding
5. Render recommendations as list
6. Add reset button
7. Use inline styles with `clamp()`

**Acceptance Criteria**:
- Results display with proper formatting
- Severity colors match specification
- Recommendations list is readable
- Reset button works

**Test**: Pass mock AnalysisResult and verify display

**Commit**: `git add . && git commit -m "Step 10: Create AnalysisResults component with color coding" && git push origin feature/plant-disease-detector`

---

## Phase 5: Application Integration

### Step 11: Build Main App Component

**Goal**: Create main App component with state management

**Tasks**:
1. Create `src/App.tsx` with default export
2. Add useState hooks:
   - `image: string | null`
   - `isLoading: boolean`
   - `result: AnalysisResult | null`
   - `error: string | null`
3. Implement `handleImageSelect(file: File)`:
   - Convert file to base64 using `fileToBase64`
   - Set image state
4. Implement `handleAnalyze()` async function:
   - Set loading true
   - Call `bedrockService.analyzePlantImage`
   - Set result on success, error on failure
   - Use try-catch-finally pattern
5. Implement `handleReset()`: Clear all state
6. Import all components

**Acceptance Criteria**:
- State management works correctly
- Async operations handle loading/error states
- All handlers properly typed

**Test**: Add console.logs to verify state changes

**Commit**: `git add . && git commit -m "Step 11: Build main App component with state management" && git push origin feature/plant-disease-detector`

---

### Step 12: Compose UI Layout

**Goal**: Wire components together in App.tsx

**Tasks**:
1. Add app header with title "Plant Disease Detector" and subtitle
2. Conditionally render ImageUpload or ImagePreview based on image state
3. Add "Analyze Plant" button (disabled when loading or no image)
4. Show loading state during analysis
5. Conditionally render AnalysisResults when result exists
6. Show error message if error exists
7. Apply responsive inline styles to layout
8. Use ternary operators for conditional rendering

**Acceptance Criteria**:
- Full user flow works: upload → analyze → results → reset
- Loading states display correctly
- Error messages show when API fails
- Layout is responsive

**Test**: Complete full workflow with real image

**Commit**: `git add . && git commit -m "Step 12: Compose UI layout and wire components" && git push origin feature/plant-disease-detector`

---

## Phase 6: Polish & Enhancement

### Step 13: Add Material-UI Icons

**Goal**: Enhance UI with Material-UI icons

**Tasks**:
1. Install dependencies:
   - `npm install @mui/material@7.3.4 @mui/icons-material@7.3.4`
   - `npm install @emotion/react@11.14.0 @emotion/styled@11.14.1`
2. Add icons to components:
   - ImageUpload: `CloudUpload`
   - AnalysisResults: `Science`
   - Buttons: appropriate action icons
3. Style icons with inline styles
4. Use `clamp()` for responsive icon sizing
5. Import individual icons (not barrel imports)

**Acceptance Criteria**:
- Icons display correctly in all components
- Icon sizes are responsive
- No console warnings about missing dependencies

**Test**: Verify icons render and scale properly

**Commit**: `git add . && git commit -m "Step 13: Add Material-UI icons" && git push origin feature/plant-disease-detector`

---

### Step 14: Enhance Interactions

**Goal**: Add interactive effects and animations

**Tasks**:
1. Add hover effects to buttons:
   - `transform: translateY(-2px)`
   - Enhanced box-shadow
   - `transition: all 0.2s`
2. Add drag-over visual feedback in ImageUpload
3. Add loading spinner during analysis (simple CSS animation)
4. Ensure all interactive elements have `cursor: pointer`
5. Add smooth transitions to state changes

**Acceptance Criteria**:
- Buttons lift on hover
- Drag-over state is visually distinct
- Loading state is clear to user
- All transitions are smooth

**Test**: Interact with all UI elements and verify animations

**Commit**: `git add . && git commit -m "Step 14: Enhance interactions with hover effects and animations" && git push origin feature/plant-disease-detector`

---

## Phase 7: Optional Backend Proxy

### Step 15: Create Backend Service

**Goal**: Create Express backend to proxy AWS credentials

**Tasks**:
1. Create `backend/` directory
2. Initialize Node.js project: `npm init -y`
3. Install dependencies: `npm install express @aws-sdk/client-bedrock-runtime cors dotenv`
4. Install dev dependencies: `npm install -D typescript @types/node @types/express`
5. Create `backend/src/server.ts`
6. Implement POST `/api/analyze` endpoint
7. Move AWS credential logic to backend
8. Create `backend/.env` for AWS credentials
9. Add CORS configuration
10. Add error handling middleware

**Acceptance Criteria**:
- Backend server runs on port 3001
- `/api/analyze` endpoint accepts base64 image
- Returns AnalysisResult JSON
- AWS credentials not exposed to frontend

**Test**: Call endpoint with curl or Postman

**Commit**: `git add . && git commit -m "Step 15: Create Express backend service" && git push origin feature/plant-disease-detector`

---

### Step 16: Update Frontend for Backend

**Goal**: Modify frontend to use backend API

**Tasks**:
1. Install axios: `npm install axios@1.13.1`
2. Create alternative backend service function
3. Add `VITE_USE_BACKEND` environment variable
4. Update App.tsx to conditionally use backend or direct Bedrock
5. Update bedrockService to check environment variable
6. Add backend URL configuration
7. Update error handling for HTTP errors

**Acceptance Criteria**:
- Frontend can toggle between direct and backend modes
- Backend mode works without AWS credentials in frontend .env
- Error messages are consistent between modes

**Test**: Toggle VITE_USE_BACKEND and verify both modes work

**Commit**: `git add . && git commit -m "Step 16: Update frontend to support backend proxy" && git push origin feature/plant-disease-detector`

---

## Phase 8: Testing & Documentation

### Step 17: Manual Testing

**Goal**: Thoroughly test application functionality

**Tasks**:
1. Test with healthy plant images
2. Test with diseased plant images
3. Test with pest-damaged plant images
4. Test invalid file types (PDF, GIF, etc.)
5. Test oversized files (>5MB)
6. Test error handling (invalid AWS credentials)
7. Test responsive design on mobile, tablet, desktop
8. Test drag-and-drop functionality
9. Test click-to-upload functionality
10. Verify all console logs work correctly

**Acceptance Criteria**:
- All test cases pass
- No console errors (except expected validation errors)
- UI is usable on all screen sizes
- Error messages are helpful

**Test**: Complete all test scenarios and document results

**Commit**: `git add . && git commit -m "Step 17: Complete manual testing" && git push origin feature/plant-disease-detector`

---

### Step 18: Documentation

**Goal**: Create comprehensive project documentation

**Tasks**:
1. Write README.md with:
   - Project description
   - Features list
   - Prerequisites
   - Installation instructions
   - Configuration steps
   - Usage instructions
2. Create SETUP.md with:
   - Detailed AWS account setup
   - Bedrock model access instructions
   - IAM permissions required
   - Troubleshooting guide
3. Document all environment variables
4. Add code examples
5. Include screenshots of application

**Acceptance Criteria**:
- New user can set up project from README alone
- All environment variables documented
- AWS setup is clear and complete

**Test**: Have someone else follow the README to set up the project

**Commit**: `git add . && git commit -m "Step 18: Add comprehensive documentation" && git push origin feature/plant-disease-detector`

---

## Phase 9: Production Readiness

### Step 19: Build Optimization

**Goal**: Optimize application for production deployment

**Tasks**:
1. Run `npm run build`
2. Verify build completes without errors
3. Check bundle size in `dist/` directory
4. Run `npm run preview` to test production build locally
5. Verify all features work in production build
6. Check for any console warnings
7. Optimize images if needed
8. Review and minimize bundle size

**Acceptance Criteria**:
- Production build is under 1MB (excluding node_modules)
- No build errors or warnings
- Production preview works identically to dev

**Test**: Run production build and test all features

**Commit**: `git add . && git commit -m "Step 19: Optimize build for production" && git push origin feature/plant-disease-detector`

---

### Step 20: Deployment

**Goal**: Deploy application to production hosting

**Tasks**:
1. Choose hosting platform (AWS S3 + CloudFront, Netlify, or Vercel)
2. Configure environment variables in hosting platform
3. Deploy production build
4. Test deployed application with real AWS credentials
5. Verify all features work in production
6. Set up custom domain (optional)
7. Configure CI/CD pipeline (optional)
8. Add deployment instructions to README

**Acceptance Criteria**:
- Application is publicly accessible
- All features work in production environment
- Environment variables are properly configured
- HTTPS is enabled

**Test**: Access deployed URL and complete full workflow

**Commit**: `git add . && git commit -m "Step 20: Deploy application to production" && git push origin feature/plant-disease-detector`

---

## Completion

### Create Pull Request

After completing all steps:

```bash
# Ensure all changes are pushed
git push origin feature/plant-disease-detector

# Create pull request using GitHub CLI
gh pr create --title "Feature: Plant Disease Detector Implementation" --body "Implements complete plant disease detector application with AWS Bedrock integration.

## Summary
- ✅ All 20 implementation steps completed
- ✅ Full test coverage
- ✅ Documentation complete
- ✅ Production ready

## Testing
- Tested with multiple plant images
- Verified responsive design
- Confirmed AWS Bedrock integration
- Production build optimized

## Screenshots
[Add screenshots of the application]"
```

Or create PR via GitHub web interface at: `https://github.com/[username]/[repo]/compare/main...feature/plant-disease-detector`

---

## Key Principles

- **Non-interactive execution**: Use only commands that don't require user input (use `-y`, `--yes`, or provide all arguments)
- **Test immediately**: Verify each step works before moving forward
- **Commit often**: Commit after each working step
- **Minimal code**: Write only what's needed for that step
- **Iterate**: Each step should produce a working (even if incomplete) application
- **Debug early**: Use console logs liberally during development

---

## Quick Reference

### Code Style Guidelines
- No semicolons
- Single quotes for strings
- Arrow functions for components
- Named exports (except App.tsx)
- Inline styles with `clamp()` for responsiveness
- TypeScript strict mode
- Explicit type annotations

### State Management Pattern
```typescript
const [state, setState] = useState<Type | null>(null)
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<string | null>(null)
```

### Error Handling Pattern
```typescript
try {
  const result = await apiCall()
  setResult(result)
} catch (err) {
  setError(err instanceof Error ? err.message : 'Fallback message')
} finally {
  setIsLoading(false)
}
```

### Responsive Styling Pattern
```typescript
fontSize: 'clamp(12px, 2vw, 16px)'
padding: 'clamp(12px, 2vw, 20px)'
```
