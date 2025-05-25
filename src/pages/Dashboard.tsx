import React, { useEffect, useState } from 'react';
import { loadTransactions } from '../utils/storage';
import { calculateDashboardData } from '../utils/dashboardCalculations';
import { Transaction, DashboardSummary } from '../types';
import PageContainer from '../components/Layout/PageContainer';
import TransactionList from '../components/Transactions/TransactionList';
import SummaryCards from '../components/Dashboard/SummaryCards';
import ExpensesByCategoryChart from '../components/Dashboard/ExpensesByCategoryChart';
import IncomeExpenseChart from '../components/Dashboard/IncomeExpenseChart';
import { ChevronRight, FileEdit } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const storedTransactions = loadTransactions();
    setTransactions(storedTransactions);
    
    // Calculate dashboard data
    if (storedTransactions.length > 0) {
      const data = calculateDashboardData(storedTransactions);
      setDashboardData(data);
    } else {
      setDashboardData({
        totalIncome: 0,
        totalExpenses: 0,
        profit: 0,
        recentTransactions: [],
        expensesByCategory: [],
        incomeVsExpenses: {
          labels: [],
          income: [],
          expenses: []
        }
      });
    }
  }, []);
  
  const handleEditTransaction = (transaction: Transaction) => {
    navigate(`/edit-transaction/${transaction.id}`);
  };
  
  const handleDeleteTransaction = (id: string) => {
    // The actual deletion will be handled in the parent component
    // For now, just navigate to the transaction
    navigate(`/edit-transaction/${id}`);
  };
  
  // Empty state for no transactions
  if (transactions.length === 0) {
    return (
      <PageContainer title="Financial Dashboard" subtitle="Track your business finances at a glance">
        <div className="mt-10 text-center py-10 px-6 border-2 border-dashed border-gray-300 rounded-lg">
          <FileEdit className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No transactions yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first transaction
          </p>
          <div className="mt-6">
            <Link to="/add-transaction" className="btn btn-primary">
              Add Transaction
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer title="Financial Dashboard" subtitle="Track your business finances at a glance">
      {dashboardData && (
        <div className="space-y-8 animate-fade-in">
          {/* Summary Cards */}
          <SummaryCards 
            totalIncome={dashboardData.totalIncome}
            totalExpenses={dashboardData.totalExpenses}
            profit={dashboardData.profit}
          />
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Income vs Expenses Chart */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900">Income vs Expenses</h3>
              <p className="text-sm text-gray-500 mb-4">Last 7 days</p>
              <IncomeExpenseChart 
                labels={dashboardData.incomeVsExpenses.labels}
                income={dashboardData.incomeVsExpenses.income}
                expenses={dashboardData.incomeVsExpenses.expenses}
              />
            </div>
            
            {/* Expenses by Category Chart */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900">Expenses by Category</h3>
              <p className="text-sm text-gray-500 mb-4">All time</p>
              <ExpensesByCategoryChart 
                expensesByCategory={dashboardData.expensesByCategory} 
              />
            </div>
          </div>
          
          {/* Recent Transactions */}
          <div className="card">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <Link to="/transactions" className="text-sm text-primary-600 flex items-center hover:text-primary-800">
                View all
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
            <div className="px-6 py-3">
              <TransactionList 
                transactions={dashboardData.recentTransactions}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Dashboard;