
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}

const PageHeader = ({ title, subtitle, className = "", children, action }: PageHeaderProps) => {
  return (
    <div className={`py-12 md:py-20 text-center ${className}`}>
      <h1 className="heading-lg mb-4">{title}</h1>
      {subtitle && <p className="text-gray-300 max-w-2xl mx-auto mb-6">{subtitle}</p>}
      {action && <div className="mt-6">{action}</div>}
      {children}
    </div>
  );
};

export default PageHeader;
