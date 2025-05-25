import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '../components/Layout/PageContainer';
import TransactionForm from '../components/Transactions/TransactionForm';
import { TransactionFormData, Transaction } from '../types';
import { loadTransactions, updateTransaction, deleteTransaction } from '../utils/storage';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

const EditTransaction: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState<TransactionFormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!id) return;
    
    const transactions = loadTransactions();
    const found = transactions.find(t => t.id === id);
    
    if (found) {
      setTransaction(found);
      setFormData({
        date: found.date,
        amount: found.amount.toString(),
        vendor: found.vendor,
        category: found.category,
        notes: found.notes,
        type: found.type
      });
    } else {
      setError('Transaction not found');
    }
  }, [id]);
  
  const handleUpdate = (data: TransactionFormData) => {
    if (!transaction) return;
    
    const updatedTransaction: Transaction = {
      ...transaction,
      date: data.date,
      amount: parseFloat(data.amount),
      vendor: data.vendor,
      category: data.category,
      notes: data.notes,
      type: data.type
    };
    
    updateTransaction(updatedTransaction);
    navigate('/');
  };
  
  const handleDelete = () => {
    if (!transaction) return;
    
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(transaction.id);
      navigate('/');
    }
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  if (error) {
    return (
      <PageContainer>
        <div className="text-center py-10">
          <div className="flex flex-col items-center">
            <AlertTriangle className="h-12 w-12 text-warning-500" />
            <h2 className="mt-2 text-lg font-medium text-gray-900">{error}</h2>
            <p className="mt-1 text-gray-500">The transaction you're looking for doesn't exist.</p>
            <button 
              onClick={handleGoBack}
              className="mt-4 btn btn-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }
  
  if (!transaction || !formData) {
    return (
      <PageContainer>
        <div className="text-center py-10">
          <p>Loading transaction...</p>
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer title="Edit Transaction" subtitle="Update or delete transaction details">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <TransactionForm 
          initialData={formData}
          onSubmit={handleUpdate}
          isEditing
        />
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleDelete}
            className="btn btn-danger w-full"
          >
            Delete Transaction
          </button>
        </div>
      </div>
      
      <div className="text-center">
        <button 
          onClick={handleGoBack}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Cancel and go back
        </button>
      </div>
    </PageContainer>
  );
};

export default EditTransaction;