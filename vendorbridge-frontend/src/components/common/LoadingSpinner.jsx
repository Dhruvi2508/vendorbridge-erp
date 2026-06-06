import React from 'react';

const LoadingSpinner = ({ fullScreen, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  };

  const spinner = (
    <div className={`${sizeClasses[size]} rounded-full border-primary border-t-transparent animate-spin`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-md">{spinner}</div>;
};

export default LoadingSpinner;
