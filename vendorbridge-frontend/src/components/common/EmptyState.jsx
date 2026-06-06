import React from 'react';

const EmptyState = ({ title = 'No data available', message, actionText, onAction, icon = 'search_off' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-2xl text-center">
      <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-lg">
        <span className="material-symbols-outlined text-[48px] text-outline">{icon}</span>
      </div>
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs">{title}</h3>
      {message && <p className="text-on-surface-variant text-body-md mb-lg max-w-sm">{message}</p>}
      {actionText && onAction && (
        <button onClick={onAction} className="text-primary font-bold hover:underline transition-all">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
