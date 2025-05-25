import { TransactionFormData, TransactionCategory } from '../types';
import { getCurrentDateString } from './formatters';

interface RecognitionResult {
  success: boolean;
  data?: Partial<TransactionFormData>;
  message?: string;
}

// Parse a voice command to extract transaction details
export const parseVoiceCommand = (text: string): RecognitionResult => {
  if (!text) {
    return { success: false, message: 'No text provided' };
  }
  
  const data: Partial<TransactionFormData> = {
    date: getCurrentDateString(),
    type: text.toLowerCase().includes('income') ? 'income' : 'expense',
  };
  
  // Try to extract amount
  const amountRegex = /\$?(\d+(?:\.\d{1,2})?)/;
  const amountMatch = text.match(amountRegex);
  if (amountMatch) {
    data.amount = amountMatch[1];
  }
  
  // Try to extract vendor
  const vendorRegexPatterns = [
    /(?:to|from|at|for|with)\s+([A-Z][A-Za-z\s']+)(?:for|on|in)?/,
    /(?:paid|spent|got|received)\s+(?:at|from|to)\s+([A-Z][A-Za-z\s']+)/
  ];
  
  for (const pattern of vendorRegexPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      data.vendor = match[1].trim();
      break;
    }
  }
  
  // Try to extract category
  const categoryKeywords: Record<TransactionCategory, string[]> = {
    food: ['food', 'restaurant', 'lunch', 'dinner', 'breakfast', 'grocery'],
    transportation: ['gas', 'uber', 'lyft', 'taxi', 'car', 'fuel', 'transportation'],
    utilities: ['utility', 'utilities', 'electric', 'water', 'gas', 'internet', 'phone'],
    rent: ['rent', 'mortgage', 'lease', 'housing', 'apartment'],
    salary: ['salary', 'paycheck', 'pay', 'wage', 'income'],
    sales: ['sale', 'sales', 'revenue', 'client', 'customer'],
    entertainment: ['movie', 'entertainment', 'game', 'ticket', 'concert', 'show'],
    marketing: ['marketing', 'advertisement', 'ad', 'promotion'],
    office: ['office', 'supplies', 'paper', 'printer', 'stationery'],
    software: ['software', 'subscription', 'app', 'service', 'license'],
    other: ['other', 'miscellaneous']
  };
  
  const lowercaseText = text.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (lowercaseText.includes(keyword)) {
        data.category = category as TransactionCategory;
        break;
      }
    }
    
    if (data.category) break;
  }
  
  // Extract any notes
  const notesRegex = /notes?:?\s+(.+?)(?:\.|$)/i;
  const notesMatch = text.match(notesRegex);
  if (notesMatch) {
    data.notes = notesMatch[1].trim();
  }
  
  // Assess success
  const hasRequiredFields = data.amount && (data.vendor || data.category);
  
  return {
    success: hasRequiredFields,
    data,
    message: hasRequiredFields 
      ? 'Successfully parsed voice command' 
      : 'Could not extract all required information'
  };
};

// Check if the Web Speech API is available
export const isVoiceRecognitionAvailable = (): boolean => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

// Start voice recognition
export const startVoiceRecognition = (
  onResult: (text: string) => void,
  onError: (error: string) => void
): { stop: () => void } => {
  // Use the appropriate speech recognition object
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    onError('Speech recognition is not supported in this browser');
    return { stop: () => {} };
  }
  
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };
  
  recognition.onerror = (event) => {
    onError(`Speech recognition error: ${event.error}`);
  };
  
  recognition.start();
  
  return {
    stop: () => recognition.stop()
  };
};