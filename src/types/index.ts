export interface UploadedImage {
  file: File;
  preview: string;
  base64?: string;
}

export interface AnalysisResult {
  disease?: string;
  pest?: string;
  severity?: string;
  confidence?: number;
  recommendations?: string[];
}
