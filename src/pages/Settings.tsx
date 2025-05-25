import React, { useState } from 'react';
import PageContainer from '../components/Layout/PageContainer';
import { AlertTriangle, Download, Upload, Trash2 } from 'lucide-react';
import { loadTransactions, saveTransactions } from '../utils/storage';
import { Transaction } from '../types';

const Settings: React.FC = () => {
  const [message, setMessage] = useState<{text: string; type: 'success' | 'error'} | null>(null);
  
  const exportData = () => {
    try {
      const transactions = loadTransactions();
      const dataStr = JSON.stringify(transactions, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `financial-copilot-export-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setMessage({
        text: 'Data exported successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Export error:', error);
      setMessage({
        text: 'Failed to export data',
        type: 'error'
      });
    }
  };
  
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as Transaction[];
        
        // Validate the data structure
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format. Expected an array of transactions.');
        }
        
        // Very basic validation of each transaction
        for (const transaction of data) {
          if (!transaction.id || 
              !transaction.date || 
              typeof transaction.amount !== 'number' || 
              !transaction.vendor || 
              !transaction.type) {
            throw new Error('Invalid transaction format in import file.');
          }
        }
        
        saveTransactions(data);
        setMessage({
          text: `Successfully imported ${data.length} transactions`,
          type: 'success'
        });
      } catch (error) {
        console.error('Import error:', error);
        setMessage({
          text: `Error importing data: ${error instanceof Error ? error.message : 'Invalid format'}`,
          type: 'error'
        });
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };
  
  const clearAllData = () => {
    if (window.confirm('Are you sure you want to delete ALL transactions? This cannot be undone.')) {
      saveTransactions([]);
      setMessage({
        text: 'All data has been cleared',
        type: 'success'
      });
    }
  };
  
  return (
    <PageContainer title="Settings" subtitle="Manage your data and preferences">
      <div className="space-y-6">
        {message && (
          <div className={`p-4 rounded-md ${
            message.type === 'success' ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'
          }`}>
            {message.text}
          </div>
        )}
        
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Data Management</h3>
          </div>
          
          <div className="px-6 py-5 space-y-6">
            {/* Export Data */}
            <div>
              <h4 className="text-sm font-medium text-gray-900">Export Data</h4>
              <p className="mt-1 text-sm text-gray-500">
                Download all your financial data as a JSON file for backup
              </p>
              <button 
                onClick={exportData}
                className="mt-3 btn btn-outline flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </button>
            </div>
            
            <div className="pt-5 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900">Import Data</h4>
              <p className="mt-1 text-sm text-gray-500">
                Restore your data from a previously exported file
              </p>
              <label 
                htmlFor="file-upload" 
                className="mt-3 btn btn-outline flex items-center cursor-pointer inline-block"
              >
                <Upload className="mr-2 h-4 w-4" />
                Import Data
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept=".json"
                  className="sr-only"
                  onChange={importData}
                />
              </label>
            </div>
            
            <div className="pt-5 border-t border-gray-200">
              <h4 className="text-sm font-medium text-danger-700">Danger Zone</h4>
              <p className="mt-1 text-sm text-gray-500">
                Clear all your data. This action cannot be undone.
              </p>
              <button 
                onClick={clearAllData}
                className="mt-3 btn btn-danger flex items-center"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All Data
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 rounded-lg p-4 flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-amber-800">MVP Application Notice</h4>
            <p className="mt-1 text-sm text-amber-700">
              This is an MVP (Minimum Viable Product) version of the Financial Copilot app. 
              Your data is currently stored only in your browser's local storage. 
              For production use, we recommend regular data exports for backup.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Settings;