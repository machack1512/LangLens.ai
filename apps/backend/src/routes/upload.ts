import { Router, Request, Response } from 'express';
import { OCRService } from '../service/ocrService';
import { validateImage } from '../utils/validation';

export const uploadRouter: Router = Router();
const ocrService = new OCRService();

uploadRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { image } = req.body;

    // Validate the image
    const validationResult = validateImage(image);
    if (!validationResult.isValid) {
      return res.status(400).json({ 
        error: 'Invalid image', 
        message: validationResult.error 
      });
    }

    // Process the image with OCR
    const ocrResult = await ocrService.processImage(image);

    if (ocrResult.success) {
      return res.json({
        success: true,
        text: ocrResult.text,
        confidence: ocrResult.confidence,
        language: ocrResult.language,
        processingTime: ocrResult.processingTime
      });
    } else {
      return res.status(422).json({
        success: false,
        error: ocrResult.error,
        message: 'OCR processing failed'
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});