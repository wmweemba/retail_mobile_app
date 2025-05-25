import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/Layout/PageContainer';
import TransactionList from '../components/Transactions/TransactionList';
import { Transaction, TransactionCategory, TransactionType } from '../types';
import { loadTransactions } from '../utils/storage';
import { Search } from 'lucide-react';

const AllTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadedTransactions = loadTransactions();
    // Sort by date, newest first
    const sorted = [...loadedTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setTransactions(sorted);
    setFilteredTransactions(sorted);
  }, []);
  
  useEffect(() => {
    let filtered = [...transactions];
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }
    
    // Apply search filter (search in vendor, notes, category)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.vendor.toLowerCase().includes(term) || 
        t.notes.toLowerCase().includes(term) || 
        t.category.toLowerCase().includes(term)
      );
    }
    
    setFilteredTransactions(filtered);
  }, [searchTerm, typeFilter, transactions]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value as TransactionType | 'all');
  };
  
  const handleEditTransaction = (transaction: Transaction) => {
    navigate(`/edit-transaction/${transaction.id}`);
  };
  
  const handleDeleteTransaction = (id: string) => {
    navigate(`/edit-transaction/${id}`);
  };
  
  return (
    <PageContainer title="All Transactions" subtitle="View and manage all your financial transactions">
      <div className="bg-white shadow-sm rounded-lg">
        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="input py-2 pl-10 pr-3 w-full"
              />
            </div>
            
            <div className="sm:w-40">
              <select
                value={typeFilter}
                onChange={handleTypeFilterChange}
                className="input py-2 px-3 w-full"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expenses</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Transaction List */}
        <div className="px-0">
          <TransactionList
            transactions={filteredTransactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default AllTransactions;