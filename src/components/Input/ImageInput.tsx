import React, { useState } from 'react';
import { Upload, X, UserCircle as LoaderCircle, Image as ImageIcon } from 'lucide-react';
import { processReceiptImage } from '../../utils/imageProcessing';
import { TransactionFormData } from '../../types';

interface ImageInputProps {
  onImageData: (data: Partial<TransactionFormData>, text: string) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ onImageData }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Process image
    setIsProcessing(true);
    setError(null);
    setExtractedText(null);
    
    try {
      const result = await processReceiptImage(file);
      
      if (result.success && result.data) {
        onImageData(result.data, result.text || '');
        setExtractedText(result.text || '');
      } else {
        setError(result.message || 'Failed to extract data from image');
      }
    } catch (err) {
      setError(`Error processing image: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const clearImage = () => {
    setImagePreview(null);
    setExtractedText(null);
    setError(null);
  };
  
  return (
    <div className="rounded-lg bg-gray-50 p-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Receipt Scanner</h3>
        <p className="text-sm text-gray-500 mt-1">
          Upload a receipt image to extract transaction details
        </p>
      </div>
      
      {!imagePreview ? (
        <div className="mt-4">
          <label
            htmlFor="receipt-upload"
            className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <div className="space-y-1 text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="receipt-upload"
                  className="relative cursor-pointer font-medium text-primary-600 hover:text-primary-500"
                >
                  <span>Upload a receipt</span>
                  <input
                    id="receipt-upload"
                    name="receipt"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageUpload}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
          </label>
        </div>
      ) : (
        <div className="mt-4 relative">
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-500 hover:text-danger-500 transition-colors"
            aria-label="Clear image"
          >
            <X size={20} />
          </button>
          <div className="rounded-md overflow-hidden border border-gray-200">
            <img 
              src={imagePreview} 
              alt="Receipt preview" 
              className="w-full object-contain max-h-56" 
            />
          </div>
          
          {isProcessing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-md">
              <LoaderCircle className="h-10 w-10 text-white animate-spin" />
              <p className="text-white mt-2">Processing receipt...</p>
            </div>
          )}
        </div>
      )}
      
      {extractedText && (
        <div className="mt-4 p-3 bg-white rounded border border-gray-200">
          <p className="text-sm text-gray-700 font-medium">Extracted text:</p>
          <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">
            {extractedText.length > 200 
              ? extractedText.substring(0, 200) + '...' 
              : extractedText}
          </p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-danger-50 text-danger-700 rounded-md">
          {error}
        </div>
      )}
      
      {!imagePreview && (
        <div className="text-center mt-4">
          <button
            onClick={() => document.getElementById('receipt-upload')?.click()}
            className="btn btn-primary px-6 py-2 flex items-center mx-auto"
          >
            <Upload className="mr-2 h-5 w-5" />
            Select Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageInput;