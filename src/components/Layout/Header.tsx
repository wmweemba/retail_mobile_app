import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Plus, Settings, DollarSign, FileText } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="navbar">
      <div className="container-custom py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <DollarSign className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-primary">Financial Copilot</span>
          </Link>
        </div>
      </div>
      
      {/* Mobile Navigation Bar (Bottom) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-200 py-2 px-4 z-10">
        <ul className="flex justify-around">
          <li>
            <Link 
              to="/" 
              className={`flex flex-col items-center p-1 ${isActive('/') ? 'text-primary' : 'text-base-content/60'}`}
            >
              <BarChart3 size={24} />
              <span className="text-xs mt-1">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/add-transaction" 
              className={`flex flex-col items-center p-1 ${isActive('/add-transaction') ? 'text-primary' : 'text-base-content/60'}`}
            >
              <Plus size={24} />
              <span className="text-xs mt-1">Add</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/reports" 
              className={`flex flex-col items-center p-1 ${isActive('/reports') ? 'text-primary' : 'text-base-content/60'}`}
            >
              <FileText size={24} />
              <span className="text-xs mt-1">Reports</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/settings" 
              className={`flex flex-col items-center p-1 ${isActive('/settings') ? 'text-primary' : 'text-base-content/60'}`}
            >
              <Settings size={24} />
              <span className="text-xs mt-1">Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:block border-b border-base-200">
        <div className="container-custom">
          <ul className="flex space-x-8">
            <li>
              <Link 
                to="/" 
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  isActive('/') 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-base-content/60 hover:text-base-content hover:border-base-300'
                }`}
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/add-transaction" 
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  isActive('/add-transaction') 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-base-content/60 hover:text-base-content hover:border-base-300'
                }`}
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Transaction
              </Link>
            </li>
            <li>
              <Link 
                to="/reports" 
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  isActive('/reports') 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-base-content/60 hover:text-base-content hover:border-base-300'
                }`}
              >
                <FileText className="mr-2 h-5 w-5" />
                Reports
              </Link>
            </li>
            <li>
              <Link 
                to="/settings" 
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  isActive('/settings') 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-base-content/60 hover:text-base-content hover:border-base-300'
                }`}
              >
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;