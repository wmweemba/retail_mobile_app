import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table as Tab } from 'lucide-react';
import PageContainer from '../components/Layout/PageContainer';
import TransactionForm from '../components/Transactions/TransactionForm';
import VoiceInput from '../components/Input/VoiceInput';
import ImageInput from '../components/Input/ImageInput';
import { TransactionFormData, Transaction, TransactionSource } from '../types';
import { addTransaction, generateId } from '../utils/storage';
import { Edit, Mic, Image as ImageIcon } from 'lucide-react';

const AddTransaction: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'manual' | 'voice' | 'image'>('manual');
  const [prefilledData, setPrefilledData] = useState<Partial<TransactionFormData>>({});
  const navigate = useNavigate();
  
  const handleTabChange = (tab: 'manual' | 'voice' | 'image') => {
    setActiveTab(tab);
  };
  
  const handleFormSubmit = (formData: TransactionFormData) => {
    // Create a new transaction
    const newTransaction: Transaction = {
      id: generateId(),
      date: formData.date,
      amount: parseFloat(formData.amount),
      vendor: formData.vendor,
      category: formData.category,
      notes: formData.notes,
      type: formData.type,
      source: activeTab as TransactionSource,
      createdAt: new Date().toISOString()
    };
    
    // Add to storage
    addTransaction(newTransaction);
    
    // Navigate to dashboard
    navigate('/');
  };
  
  const handleVoiceData = (data: Partial<TransactionFormData>, text: string) => {
    setPrefilledData({
      ...data,
      notes: data.notes || `Voice command: "${text}"`
    });
    // Auto switch to manual tab to review the data
    setActiveTab('manual');
  };
  
  const handleImageData = (data: Partial<TransactionFormData>, text: string) => {
    setPrefilledData({
      ...data,
      notes: data.notes || `OCR extraction from receipt`
    });
    // Auto switch to manual tab to review the data
    setActiveTab('manual');
  };
  
  return (
    <PageContainer title="Add Transaction" subtitle="Record a new financial transaction">
      {/* Input Method Tabs */}
      <div className="mb-6">
        <div className="sm:hidden">
          <label htmlFor="input-method" className="sr-only">
            Select input method
          </label>
          <select
            id="input-method"
            name="input-method"
            className="input py-2 px-3"
            value={activeTab}
            onChange={(e) => handleTabChange(e.target.value as any)}
          >
            <option value="manual">Manual Input</option>
            <option value="voice">Voice Input</option>
            <option value="image">Image Upload</option>
          </select>
        </div>
        
        <div className="hidden sm:block">
          <nav className="flex space-x-4 border-b border-gray-200">
            <button
              onClick={() => handleTabChange('manual')}
              className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === 'manual' 
                  ? 'text-primary-600 border-primary-500' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Edit className="inline-block mr-2 h-4 w-4" />
              Manual Input
            </button>
            <button
              onClick={() => handleTabChange('voice')}
              className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === 'voice' 
                  ? 'text-primary-600 border-primary-500' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Mic className="inline-block mr-2 h-4 w-4" />
              Voice Input
            </button>
            <button
              onClick={() => handleTabChange('image')}
              className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === 'image' 
                  ? 'text-primary-600 border-primary-500' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ImageIcon className="inline-block mr-2 h-4 w-4" />
              Image Upload
            </button>
          </nav>
        </div>
      </div>
      
      {/* Input Method Content */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        {activeTab === 'manual' && (
          <TransactionForm 
            initialData={prefilledData}
            onSubmit={handleFormSubmit} 
          />
        )}
        
        {activeTab === 'voice' && (
          <VoiceInput onVoiceData={handleVoiceData} />
        )}
        
        {activeTab === 'image' && (
          <ImageInput onImageData={handleImageData} />
        )}
      </div>
    </PageContainer>
  );
};

export default AddTransaction;