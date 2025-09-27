import axios from 'axios';
import FormData from 'form-data';

interface OCRResult {
  success: boolean;
  text?: string;
  confidence?: number;
  language?: string;
  processingTime?: number;
  error?: string;
}

interface OCRSpaceResponse {
  ParsedResults?: Array<{
    TextOverlay: {
      Lines: Array<any>;
      HasOverlay: boolean;
      Message: string;
    };
    TextOrientation: string;
    FileParseExitCode: number;
    ParsedText: string;
    ErrorMessage?: string;
    ErrorDetails?: string;
  }>;
  OCRExitCode: number;
  IsErroredOnProcessing: boolean;
  ProcessingTimeInMilliseconds?: string;
  ErrorMessage?: string;
  ErrorDetails?: string;
}

export class OCRService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.OCR_SPACE_API_KEY || '';
    this.apiUrl = 'https://api.ocr.space/parse/image';

    if (!this.apiKey) {
      console.warn('OCR_SPACE_API_KEY not found in environment variables');
    }
  }

  async processImage(base64Image: string): Promise<OCRResult> {
    const startTime = Date.now();

    try {
      // Remove data URL prefix if present
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

      const formData = new FormData();
      formData.append('base64Image', `data:image/jpeg;base64,${base64Data}`);
      formData.append('language', 'auto');
      formData.append('isOverlayRequired', 'false');
      formData.append('detectOrientation', 'true');
      formData.append('scale', 'true');
      formData.append('OCREngine', '2');

      const response = await axios.post<OCRSpaceResponse>(
        this.apiUrl,
        formData,
        {
          headers: {
            'apikey': this.apiKey,
            ...formData.getHeaders()
          },
          timeout: 60000
        }
      );

      const processingTime = Date.now() - startTime;

      if (response.data.IsErroredOnProcessing) {
        return {
          success: false,
          error: response.data.ErrorMessage || 'OCR processing error',
          processingTime
        };
      }

      if (response.data.ParsedResults && response.data.ParsedResults.length > 0) {
        const result = response.data.ParsedResults[0];
        
        if (result.FileParseExitCode === 1) {
          // Success
          return {
            success: true,
            text: result.ParsedText,
            confidence: this.calculateConfidence(result),
            language: 'eng',
            processingTime
          };
        } else {
          // Parse error
          return {
            success: false,
            error: result.ErrorMessage || 'Failed to parse image',
            processingTime
          };
        }
      }

      return {
        success: false,
        error: 'No results from OCR',
        processingTime
      };

    } catch (error) {
      console.error('OCR Service Error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return {
            success: false,
            error: `OCR API Error: ${error.response.status} - ${error.response.statusText}`,
            processingTime: Date.now() - startTime
          };
        } else if (error.request) {
          return {
            success: false,
            error: 'No response from OCR service',
            processingTime: Date.now() - startTime
          };
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown OCR error',
        processingTime: Date.now() - startTime
      };
    }
  }

  private calculateConfidence(result: any): number {
    // OCRSpace doesn't provide direct confidence scores,
    // but we can estimate based on the parse exit code and text length
    if (result.FileParseExitCode === 1 && result.ParsedText) {
      // Basic confidence calculation
      const textLength = result.ParsedText.trim().length;
      if (textLength > 100) return 95;
      if (textLength > 50) return 90;
      if (textLength > 20) return 85;
      if (textLength > 0) return 80;
    }
    return 0;
  }
}