import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, FileText, Share2, Calendar, Download } from 'lucide-react';
import PageContainer from '../components/Layout/PageContainer';
import { Transaction } from '../types';
import { loadTransactions } from '../utils/storage';
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { generatePDF, generateExcel } from '../utils/exportUtils';

interface DateRange {
  start: Date;
  end: Date;
  label: string;
}

const Reports: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    start: subDays(new Date(), 7),
    end: new Date(),
    label: 'Last 7 Days'
  });
  const [customDateRange, setCustomDateRange] = useState({
    start: format(new Date(), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });
  
  useEffect(() => {
    const loadedTransactions = loadTransactions();
    setTransactions(loadedTransactions);
  }, []);
  
  const predefinedRanges: { label: string; getRange: () => DateRange }[] = [
    {
      label: "Today",
      getRange: () => ({
        start: new Date(),
        end: new Date(),
        label: 'Today'
      })
    },
    {
      label: "Yesterday",
      getRange: () => ({
        start: subDays(new Date(), 1),
        end: subDays(new Date(), 1),
        label: 'Yesterday'
      })
    },
    {
      label: "Last 7 Days",
      getRange: () => ({
        start: subDays(new Date(), 7),
        end: new Date(),
        label: 'Last 7 Days'
      })
    },
    {
      label: "This Month",
      getRange: () => ({
        start: startOfMonth(new Date()),
        end: new Date(),
        label: 'This Month'
      })
    },
    {
      label: "Last Month",
      getRange: () => {
        const lastMonth = subMonths(new Date(), 1);
        return {
          start: startOfMonth(lastMonth),
          end: endOfMonth(lastMonth),
          label: 'Last Month'
        };
      }
    }
  ];
  
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= selectedRange.start && 
           transactionDate <= selectedRange.end;
  });
  
  const handleRangeSelect = (range: DateRange) => {
    setSelectedRange(range);
  };
  
  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomDateRange(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'end' && customDateRange.start) {
      setSelectedRange({
        start: new Date(customDateRange.start),
        end: new Date(value),
        label: 'Custom Range'
      });
    }
  };
  
  const handleExportPDF = () => {
    generatePDF(filteredTransactions, selectedRange.label);
  };
  
  const handleExportExcel = () => {
    generateExcel(filteredTransactions, selectedRange.label);
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Financial Report',
          text: `Financial report for ${selectedRange.label}`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };
  
  return (
    <PageContainer 
      title="Financial Reports" 
      subtitle="Generate and export detailed financial reports"
    >
      <div className="space-y-6">
        {/* Date Range Selection */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {predefinedRanges.map(({ label, getRange }) => (
            <button
              key={label}
              onClick={() => handleRangeSelect(getRange())}
              className={`btn ${
                selectedRange.label === label 
                  ? 'btn-primary' 
                  : 'btn-outline'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        
        {/* Custom Date Range */}
        <div className="card p-6">
          <h3 className="text-lg font-medium mb-4">Custom Date Range</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                name="start"
                value={customDateRange.start}
                onChange={handleCustomDateChange}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                name="end"
                value={customDateRange.end}
                onChange={handleCustomDateChange}
                className="input"
              />
            </div>
          </div>
        </div>
        
        {/* Export Options */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleExportPDF}
            className="btn btn-primary"
          >
            <FileText className="mr-2 h-5 w-5" />
            Export as PDF
          </button>
          
          <button
            onClick={handleExportExcel}
            className="btn btn-primary"
          >
            <FileSpreadsheet className="mr-2 h-5 w-5" />
            Export as Excel
          </button>
          
          {/* Share button (mobile only) */}
          {navigator.share && (
            <button
              onClick={handleShare}
              className="btn btn-outline md:hidden"
            >
              <Share2 className="mr-2 h-5 w-5" />
              Share
            </button>
          )}
        </div>
        
        {/* Transactions Table */}
        <div className="card overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Vendor</th>
                <th>Category</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{format(new Date(transaction.date), 'dd/MM/yyyy')}</td>
                  <td>{transaction.id}</td>
                  <td className={transaction.type === 'income' ? 'text-success' : 'text-error'}>
                    {transaction.type === 'income' ? '+' : '-'} K{transaction.amount.toFixed(2)}
                  </td>
                  <td className="capitalize">{transaction.type}</td>
                  <td>{transaction.vendor}</td>
                  <td className="capitalize">{transaction.category}</td>
                  <td className="capitalize">{transaction.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
};

export default Reports;