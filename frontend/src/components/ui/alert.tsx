import React from 'react';

interface AlertProps {
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'error' | 'warning' | 'success';
}

export const Alert: React.FC<AlertProps> = ({ 
  className = '', 
  children, 
  variant = 'default' 
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    success: 'bg-green-100 text-green-800'
  };

  return (
    <div className={`p-4 rounded-lg ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const AlertDescription: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => (
  <div className={`text-sm ${className}`}>
    {children}
  </div>
);