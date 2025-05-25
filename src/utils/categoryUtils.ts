import { TransactionCategory, TransactionType } from '../types';
import { 
  ShoppingBag, Utensils, Home, Car, Wifi, Package, Briefcase, DollarSign, 
  CreditCard, BookOpen, Monitor, Film, HeartPulse
} from 'lucide-react';

export const CATEGORIES: Record<TransactionCategory, { label: string, icon: typeof ShoppingBag }> = {
  food: { label: 'Food & Dining', icon: Utensils },
  transportation: { label: 'Transportation', icon: Car },
  utilities: { label: 'Utilities', icon: Wifi },
  rent: { label: 'Rent & Housing', icon: Home },
  salary: { label: 'Salary', icon: Briefcase },
  sales: { label: 'Sales', icon: DollarSign },
  entertainment: { label: 'Entertainment', icon: Film },
  marketing: { label: 'Marketing', icon: Package },
  office: { label: 'Office Supplies', icon: ShoppingBag },
  software: { label: 'Software & Tools', icon: Monitor },
  other: { label: 'Other', icon: CreditCard }
};

export const TRANSACTION_TYPES: Record<TransactionType, { label: string, color: string }> = {
  income: { label: 'Income', color: 'text-success-600' },
  expense: { label: 'Expense', color: 'text-danger-600' }
};

export const getCategoryIcon = (category: TransactionCategory) => {
  return CATEGORIES[category]?.icon || CreditCard;
};

export const getCategoryLabel = (category: TransactionCategory) => {
  return CATEGORIES[category]?.label || 'Other';
};

export const getCategoryOptions = () => {
  return Object.entries(CATEGORIES).map(([value, { label }]) => ({
    value: value as TransactionCategory,
    label
  }));
};

// Generate a tailwind color class based on category
export const getCategoryColor = (category: TransactionCategory): string => {
  const colorMap: Record<TransactionCategory, string> = {
    food: 'bg-amber-100 text-amber-800',
    transportation: 'bg-blue-100 text-blue-800',
    utilities: 'bg-purple-100 text-purple-800',
    rent: 'bg-indigo-100 text-indigo-800',
    salary: 'bg-green-100 text-green-800',
    sales: 'bg-emerald-100 text-emerald-800',
    entertainment: 'bg-pink-100 text-pink-800',
    marketing: 'bg-orange-100 text-orange-800',
    office: 'bg-gray-100 text-gray-800',
    software: 'bg-sky-100 text-sky-800',
    other: 'bg-slate-100 text-slate-800'
  };
  
  return colorMap[category] || 'bg-gray-100 text-gray-800';
};