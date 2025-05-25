export type TransactionCategory = 
  | 'food'
  | 'transportation'
  | 'utilities'
  | 'rent'
  | 'salary'
  | 'sales'
  | 'entertainment'
  | 'marketing'
  | 'office'
  | 'software'
  | 'other';

export type TransactionType = 'income' | 'expense';

export type TransactionSource = 'manual' | 'image' | 'voice';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  vendor: string;
  category: TransactionCategory;
  notes: string;
  type: TransactionType;
  source: TransactionSource;
  createdAt: string;
}

export interface TransactionFormData {
  date: string;
  amount: string;
  vendor: string;
  category: TransactionCategory;
  notes: string;
  type: TransactionType;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  profit: number;
  recentTransactions: Transaction[];
  expensesByCategory: {
    category: string;
    amount: number;
  }[];
  incomeVsExpenses: {
    labels: string[];
    income: number[];
    expenses: number[];
  };
}