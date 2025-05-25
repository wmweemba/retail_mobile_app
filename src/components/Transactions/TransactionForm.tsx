import React, { useState, useEffect } from 'react';
import { TransactionFormData, TransactionCategory, TransactionType, Transaction } from '../../types';
import { getCurrentDateString } from '../../utils/formatters';
import { getCategoryOptions, TRANSACTION_TYPES } from '../../utils/categoryUtils';

interface TransactionFormProps {
  initialData?: Partial<TransactionFormData>;
  onSubmit: (data: TransactionFormData) => void;
  isEditing?: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ 
  initialData, 
  onSubmit,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    date: getCurrentDateString(),
    amount: '',
    vendor: '',
    category: 'other',
    notes: '',
    type: 'expense',
    ...initialData
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof TransactionFormData, string>>>({});
  
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      const isValid = /^\d*\.?\d*$/.test(value);
      if (value === '' || isValid) {
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors.amount && (value !== '' && isValid)) {
          setErrors(prev => ({ ...prev, amount: undefined }));
        }
      }
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof TransactionFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleTypeChange = (type: TransactionType) => {
    setFormData(prev => ({ ...prev, type }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TransactionFormData, string>> = {};
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(formData.amount))) {
      newErrors.amount = 'Amount must be a number';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    }
    
    if (!formData.vendor) {
      newErrors.vendor = 'Vendor/Payee is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      
      if (!isEditing) {
        setFormData({
          date: getCurrentDateString(),
          amount: '',
          vendor: '',
          category: 'other',
          notes: '',
          type: 'expense'
        });
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6">
        <div className="flex w-full rounded-md shadow-sm">
          {Object.entries(TRANSACTION_TYPES).map(([type, { label, color }]) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeChange(type as TransactionType)}
              className={`flex-1 py-3 font-medium text-sm focus:outline-none transition-colors ${
                formData.type === type
                  ? `bg-primary/10 text-primary border-b-2 border-primary`
                  : 'bg-base-200 text-base-content/60 hover:bg-base-300 border-b border-base-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="date" className="block text-sm font-medium">
            Date
          </label>
          <div className="mt-1">
            <input
              type="date"
              name="date"
              id="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="input py-2 px-3"
            />
          </div>
          {errors.date && (
            <p className="mt-1 text-sm text-error">{errors.date}</p>
          )}
        </div>
        
        <div className="sm:col-span-3">
          <label htmlFor="amount" className="block text-sm font-medium">
            Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-base-content/60 sm:text-sm">K</span>
            </div>
            <input
              type="text"
              name="amount"
              id="amount"
              required
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              className="input py-2 pl-7 pr-3"
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-error">{errors.amount}</p>
          )}
        </div>
        
        <div className="sm:col-span-6">
          <label htmlFor="vendor" className="block text-sm font-medium">
            {formData.type === 'income' ? 'Payer' : 'Vendor'}
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="vendor"
              id="vendor"
              required
              value={formData.vendor}
              onChange={handleChange}
              placeholder={formData.type === 'income' ? "Who paid you?" : "Where did you spend?"}
              className="input py-2 px-3"
            />
          </div>
          {errors.vendor && (
            <p className="mt-1 text-sm text-error">{errors.vendor}</p>
          )}
        </div>
        
        <div className="sm:col-span-6">
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>
          <div className="mt-1">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input py-2 px-3"
            >
              {getCategoryOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="sm:col-span-6">
          <label htmlFor="notes" className="block text-sm font-medium">
            Notes (Optional)
          </label>
          <div className="mt-1">
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="input py-2 px-3"
              placeholder="Add details about this transaction..."
            ></textarea>
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          className="w-full btn btn-primary py-3"
        >
          {isEditing ? 'Update Transaction' : 'Save Transaction'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;