import React, { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  return (
    <div className="container-custom py-6 pb-20 md:pb-6 min-h-[calc(100vh-12rem)]">
      {title && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-gray-500 md:text-base">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default PageContainer;