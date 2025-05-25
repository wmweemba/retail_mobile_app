import { createWorker } from 'tesseract.js';
import { TransactionFormData } from '../types';
import { getCurrentDateString } from './formatters';

interface ImageProcessingResult {
  success: boolean;
  data?: Partial<TransactionFormData>;
  text?: string;
  message?: string;
}

export const processReceiptImage = async (imageFile: File): Promise<ImageProcessingResult> => {
  try {
    // Initialize the OCR worker
    const worker = await createWorker('eng');
    
    // Convert the file to a format tesseract can process
    const imageData = await readFileAsDataURL(imageFile);
    
    // Recognize text in the image
    const { data } = await worker.recognize(imageData);
    await worker.terminate();
    
    if (!data.text || data.text.trim() === '') {
      return {
        success: false,
        message: 'No text detected in the image'
      };
    }
    
    // Parse the extracted text
    const extractedData = parseReceiptText(data.text);
    
    return {
      success: true,
      data: extractedData,
      text: data.text,
      message: 'Receipt processed successfully'
    };
  } catch (error) {
    console.error('Error processing receipt image:', error);
    return {
      success: false,
      message: `Error processing image: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Convert a file to a data URL
const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Parse text from a receipt to extract transaction details
const parseReceiptText = (text: string): Partial<TransactionFormData> => {
  const data: Partial<TransactionFormData> = {
    date: getCurrentDateString(),
    type: 'expense',
  };
  
  // Look for total amount
  const totalRegexPatterns = [
    /total:?\s*\$?(\d+\.\d{2})/i,
    /amount:?\s*\$?(\d+\.\d{2})/i,
    /(?:sub)?total:?\s*\$?(\d+\.\d{2})/i,
    /\$\s*(\d+\.\d{2})/
  ];
  
  for (const pattern of totalRegexPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      data.amount = match[1];
      break;
    }
  }
  
  // Look for date
  const dateRegexPatterns = [
    /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/,
    /(\d{2,4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/
  ];
  
  for (const pattern of dateRegexPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      // Try to parse the date - keep current date if parsing fails
      try {
        const dateParts = match[1].split(/[\/\-\.]/);
        if (dateParts.length === 3) {
          // This is a simplistic approach - in a real app, you'd need to handle
          // different date formats more robustly
          if (dateParts[0].length === 4) {
            // YYYY-MM-DD format
            const date = new Date(
              parseInt(dateParts[0]),
              parseInt(dateParts[1]) - 1,
              parseInt(dateParts[2])
            );
            if (!isNaN(date.getTime())) {
              data.date = date.toISOString().split('T')[0];
            }
          } else {
            // MM-DD-YYYY format (or similar)
            const year = dateParts[2].length === 2 
              ? `20${dateParts[2]}` 
              : dateParts[2];
            const date = new Date(
              parseInt(year),
              parseInt(dateParts[0]) - 1,
              parseInt(dateParts[1])
            );
            if (!isNaN(date.getTime())) {
              data.date = date.toISOString().split('T')[0];
            }
          }
        }
      } catch (e) {
        console.error('Error parsing date:', e);
      }
      break;
    }
  }
  
  // Look for vendor/store name
  // This is tricky as it varies a lot, but we can look for common patterns
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  if (lines.length > 0) {
    // Often the store name is at the top of the receipt
    const potentialVendors = lines.slice(0, 3);
    for (const line of potentialVendors) {
      // Skip lines that are likely not the vendor name
      if (
        !line.match(/receipt/i) &&
        !line.match(/invoice/i) &&
        !line.match(/tel:/i) &&
        !line.match(/phone:/i) &&
        !line.match(/address:/i) &&
        !line.match(/\d{2}[\/\-\.]\d{2}[\/\-\.]\d{2,4}/) && // Skip date lines
        line.length > 3 && // Skip very short lines
        line.length < 30 // Skip very long lines
      ) {
        data.vendor = line.trim();
        break;
      }
    }
  }
  
  return data;
};