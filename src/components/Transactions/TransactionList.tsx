import React from 'react';
import { Transaction, TransactionCategory } from '../../types';
import { formatCurrency, getRelativeDate } from '../../utils/formatters';
import { getCategoryIcon, getCategoryColor } from '../../utils/categoryUtils';
import { Pencil, Trash2 } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  onEdit, 
  onDelete 
}) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {transactions.map((transaction) => {
          const CategoryIcon = getCategoryIcon(transaction.category);
          const categoryColorClass = getCategoryColor(transaction.category);
          
          return (
            <li 
              key={transaction.id} 
              className="py-4 px-1 hover:bg-gray-50 transition-colors animate-fade-in"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${categoryColorClass}`}>
                    <CategoryIcon size={18} />
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-900">{transaction.vendor}</div>
                    <div className="flex space-x-2 text-sm text-gray-500">
                      <span>{getRelativeDate(transaction.date)}</span>
                      <span>•</span>
                      <span className="capitalize">{transaction.category}</span>
                      {transaction.notes && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[150px]">{transaction.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`text-right ${transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'}`}>
                    <span className="font-medium">
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </span>
                    <div className="text-xs text-gray-500 capitalize">
                      via {transaction.source}
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                      aria-label="Edit transaction"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="p-1 text-gray-400 hover:text-danger-600 transition-colors"
                      aria-label="Delete transaction"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TransactionList;