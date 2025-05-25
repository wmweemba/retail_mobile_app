import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface IncomeExpenseChartProps {
  labels: string[];
  income: number[];
  expenses: number[];
}

const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ 
  labels, 
  income, 
  expenses 
}) => {
  if (!labels || !income || !expenses || labels.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: income,
        backgroundColor: 'rgba(16, 185, 129, 0.7)', // success-500 with opacity
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: expenses,
        backgroundColor: 'rgba(239, 68, 68, 0.7)', // danger-500 with opacity
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return 'K' + value;
          }
        }
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
  };

  return (
    <div className="h-80">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default IncomeExpenseChart;