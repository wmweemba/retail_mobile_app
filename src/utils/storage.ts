import { Transaction } from '../types';

const STORAGE_KEY = 'financial-copilot-transactions';

// Load transactions from localStorage
export const loadTransactions = (): Transaction[] => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error('Error loading transactions:', error);
  }
  return [];
};

// Save transactions to localStorage
export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
};

// Add a new transaction
export const addTransaction = (transaction: Transaction): Transaction[] => {
  const transactions = loadTransactions();
  const updatedTransactions = [...transactions, transaction];
  saveTransactions(updatedTransactions);
  return updatedTransactions;
};

// Update an existing transaction
export const updateTransaction = (updatedTransaction: Transaction): Transaction[] => {
  const transactions = loadTransactions();
  const updatedTransactions = transactions.map(transaction => 
    transaction.id === updatedTransaction.id ? updatedTransaction : transaction
  );
  saveTransactions(updatedTransactions);
  return updatedTransactions;
};

// Delete a transaction
export const deleteTransaction = (id: string): Transaction[] => {
  const transactions = loadTransactions();
  const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
  saveTransactions(updatedTransactions);
  return updatedTransactions;
};

// Generate a unique ID for a new transaction
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};