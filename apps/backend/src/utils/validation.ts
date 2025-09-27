interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateImage(imageData: string): ValidationResult {
  if (!imageData) {
    return { isValid: false, error: 'No image data provided' };
  }

  // Check if it's a valid base64 image
  const base64Regex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;
  if (!base64Regex.test(imageData)) {
    return { isValid: false, error: 'Invalid image format. Expected base64 encoded image.' };
  }

  // Check size (approximate - base64 is ~1.37x larger than original)
  const sizeInBytes = (imageData.length * 3) / 4;
  const maxSizeInMB = 10; // Maximum 10MB
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (sizeInBytes > maxSizeInBytes) {
    return { 
      isValid: false, 
      error: `Image size exceeds maximum allowed size of ${maxSizeInMB}MB` 
    };
  }

  return { isValid: true };
}