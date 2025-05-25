import { Transaction, DashboardSummary } from '../types';
import { format, subDays } from 'date-fns';

export const calculateDashboardData = (transactions: Transaction[]): DashboardSummary => {
  // Total income, expenses, and profit
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const profit = totalIncome - totalExpenses;
  
  // Recent transactions (last 10)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);
  
  // Expenses by category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: {category: string; amount: number}[], transaction) => {
      const existingCategory = acc.find(item => item.category === transaction.category);
      
      if (existingCategory) {
        existingCategory.amount += transaction.amount;
      } else {
        acc.push({
          category: transaction.category,
          amount: transaction.amount
        });
      }
      
      return acc;
    }, [])
    .sort((a, b) => b.amount - a.amount);
  
  // Income vs Expenses over time (last 7 days)
  const today = new Date();
  const labels: string[] = [];
  const incomeData: number[] = [];
  const expenseData: number[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const dateString = format(date, 'yyyy-MM-dd');
    const formattedDate = format(date, 'MMM d');
    
    labels.push(formattedDate);
    
    const dayIncome = transactions
      .filter(t => t.type === 'income' && t.date.startsWith(dateString))
      .reduce((sum, t) => sum + t.amount, 0);
      
    const dayExpenses = transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(dateString))
      .reduce((sum, t) => sum + t.amount, 0);
      
    incomeData.push(dayIncome);
    expenseData.push(dayExpenses);
  }
  
  return {
    totalIncome,
    totalExpenses,
    profit,
    recentTransactions,
    expensesByCategory,
    incomeVsExpenses: {
      labels,
      income: incomeData,
      expenses: expenseData
    }
  };
};