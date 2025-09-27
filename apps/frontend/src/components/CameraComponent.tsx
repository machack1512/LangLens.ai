import { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '../services/translate';

interface OCRResult {
  text: string;
  detectedLanguage?: string;
  confidence?: number;
}

interface CameraComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture?: (imageData: string) => void;
  onOCRResult?: (result: OCRResult) => void;
}

export const CameraComponent: React.FC<CameraComponentProps> = ({ 
  isOpen, 
  onClose, 
  onCapture,
  onOCRResult
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
        setIsProcessing(true);

        try {
          const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageData })
          });
          const result = await response.json();
          console.log("OCR Result:", result);
          onCapture && onCapture(imageData);
          if (onOCRResult && result) {
            const ocrResult: OCRResult = {
              text: result.text || result.extractedText || '',
              detectedLanguage: result.detectedLanguage || result.language,
              confidence: result.confidence
            };
            onOCRResult(ocrResult);
          }
          
          setIsProcessing(false);
          handleClose();
        } catch (error) {
          console.error("Error processing image:", error);
          setIsProcessing(false);
          startCamera();
          setCapturedImage(null);
        }
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user', // or 'environment' for rear camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      if (videoRef.current && isOpen) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      } else {
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    setIsProcessing(false);
    onClose();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setIsProcessing(false);
    startCamera();
  };

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    } else if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      setIsProcessing(false);
    }
    
    return () => {
      stopCamera();
    };
  }, [isOpen, capturedImage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-4 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {capturedImage ? 'Captured Image' : 'Camera'}
          </h2>
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className={`p-2 rounded-full text-white transition-colors ${
              isProcessing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gray-500 hover:bg-gray-800'
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          {/* Show captured image if available, otherwise show video */}
          {capturedImage ? (
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            >
              <track kind="captions" />
            </video>
          )}
          
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Action buttons */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {!capturedImage ? (
              // Capture button
              <button
                onClick={captureImage}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full shadow-lg flex items-center space-x-2 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Capture</span>
              </button>
            ) : (
              <>
                {isProcessing ? (
                  // Processing button (disabled)
                  <button
                    disabled
                    className="bg-gray-400 text-white px-6 py-2 rounded-full shadow-lg flex items-center space-x-2 cursor-not-allowed"
                  >
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Processing...</span>
                  </button>
                ) : (
                  // Retake button (shown after processing or if needed)
                  <button
                    onClick={retakePhoto}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full shadow-lg flex items-center space-x-2 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Retake</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};