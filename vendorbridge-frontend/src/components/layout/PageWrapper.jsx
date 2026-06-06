import React from 'react';

const PageWrapper = ({ title, description, actions, children }) => {
  return (
    <div className="space-y-lg flex-1 flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">{title}</h2>
          {description && <p className="text-on-surface-variant text-body-md mt-xs">{description}</p>}
        </div>
        {actions && <div className="flex gap-md w-full sm:w-auto">{actions}</div>}
      </div>
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
