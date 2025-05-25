import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { DollarSign, TrendingUp, TrendingDown, CircleDollarSign } from 'lucide-react';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  profit: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ 
  totalIncome, 
  totalExpenses, 
  profit 
}) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {/* Income Card */}
      <div className="card p-6 transition-all duration-300 animate-fade-in">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <TrendingUp className="h-8 w-8 text-success-500" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Income</dt>
              <dd>
                <div className="text-lg font-semibold text-success-600">
                  {formatCurrency(totalIncome)}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Expenses Card */}
      <div className="card p-6 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <TrendingDown className="h-8 w-8 text-danger-500" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
              <dd>
                <div className="text-lg font-semibold text-danger-600">
                  {formatCurrency(totalExpenses)}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Profit Card */}
      <div className="card p-6 sm:col-span-2 lg:col-span-1 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CircleDollarSign className="h-8 w-8 text-primary-500" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Net Profit</dt>
              <dd>
                <div className={`text-lg font-semibold ${profit >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {formatCurrency(profit)}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;