import React, { useState, useEffect } from 'react';
import { Mic, MicOff, UserCircle as LoaderCircle } from 'lucide-react';
import { isVoiceRecognitionAvailable, startVoiceRecognition, parseVoiceCommand } from '../../utils/voiceRecognition';
import { TransactionFormData } from '../../types';

interface VoiceInputProps {
  onVoiceData: (data: Partial<TransactionFormData>, text: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceData }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [stopListening, setStopListening] = useState<(() => void) | null>(null);
  
  useEffect(() => {
    setIsSupported(isVoiceRecognitionAvailable());
  }, []);
  
  const handleStartListening = () => {
    if (!isSupported) {
      setError('Voice recognition is not supported in your browser');
      return;
    }
    
    setIsListening(true);
    setError(null);
    setTranscript('');
    
    const { stop } = startVoiceRecognition(
      (text) => {
        setTranscript(text);
        setIsListening(false);
        
        // Parse the voice command
        const result = parseVoiceCommand(text);
        if (result.success && result.data) {
          onVoiceData(result.data, text);
        } else {
          setError(result.message || 'Could not understand the command');
        }
      },
      (errorMessage) => {
        setError(errorMessage);
        setIsListening(false);
      }
    );
    
    setStopListening(() => stop);
  };
  
  const handleStopListening = () => {
    if (stopListening) {
      stopListening();
    }
    setIsListening(false);
  };
  
  if (!isSupported) {
    return (
      <div className="rounded-lg bg-gray-50 p-4 text-center">
        <MicOff className="h-12 w-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-600">Voice recognition is not supported in your browser.</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-lg bg-gray-50 p-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Voice Input</h3>
        <p className="text-sm text-gray-500 mt-1">
          Say a command like "Add expense of $24.99 to Grocery Store"
        </p>
      </div>
      
      <div className="flex justify-center mt-4">
        {isListening ? (
          <button
            onClick={handleStopListening}
            className="btn btn-danger px-6 py-3 flex items-center"
          >
            <MicOff className="mr-2 h-5 w-5" />
            Stop Listening
          </button>
        ) : (
          <button
            onClick={handleStartListening}
            className="btn btn-primary px-6 py-3 flex items-center"
          >
            <Mic className="mr-2 h-5 w-5" />
            Start Speaking
          </button>
        )}
      </div>
      
      {isListening && (
        <div className="text-center mt-4">
          <LoaderCircle className="h-8 w-8 mx-auto text-primary-500 animate-spin" />
          <p className="text-primary-600 mt-2">Listening...</p>
        </div>
      )}
      
      {transcript && (
        <div className="mt-4 p-3 bg-white rounded border border-gray-200">
          <p className="text-sm text-gray-700 font-medium">Detected speech:</p>
          <p className="text-gray-900">{transcript}</p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-danger-50 text-danger-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default VoiceInput;