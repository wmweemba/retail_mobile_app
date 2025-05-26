import { create } from 'zustand';
import { Transaction } from '../types';

interface TransactionsState {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
}

export const useTransactionsStore = create<TransactionsState>((set) => ({
  transactions: [],
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) => set((state) => ({ transactions: [transaction, ...state.transactions] })),
  updateTransaction: (transaction) => set((state) => ({
    transactions: state.transactions.map((t) => t.id === transaction.id ? transaction : t)
  })),
  removeTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter((t) => t.id !== id)
  })),
})); 