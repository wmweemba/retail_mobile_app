import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getCategoryLabel } from '../../utils/categoryUtils';
import { formatCurrency } from '../../utils/formatters';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpensesByCategoryChartProps {
  expensesByCategory: {
    category: string;
    amount: number;
  }[];
}

const CHART_COLORS = [
  '#3b82f6', // primary-500
  '#10b981', // success-500
  '#f59e0b', // warning-500
  '#ef4444', // danger-500
  '#8b5cf6', // purple-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
  '#6366f1', // indigo-500
  '#a855f7', // purple-500
  '#64748b', // slate-500
];

const ExpensesByCategoryChart: React.FC<ExpensesByCategoryChartProps> = ({ 
  expensesByCategory 
}) => {
  if (!expensesByCategory || expensesByCategory.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No expense data available</p>
      </div>
    );
  }

  const chartData = {
    labels: expensesByCategory.map(item => getCategoryLabel(item.category as any)),
    datasets: [
      {
        data: expensesByCategory.map(item => item.amount),
        backgroundColor: CHART_COLORS.slice(0, expensesByCategory.length),
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            size: 12,
          },
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="h-80">
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
};

export default ExpensesByCategoryChart;