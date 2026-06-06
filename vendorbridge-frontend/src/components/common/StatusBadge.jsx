import React from 'react';

const StatusBadge = ({ status }) => {
  if (!status) return null;
  const normalized = status.toUpperCase();

  let styles = 'bg-surface-container text-on-surface border border-outline-variant';
  let icon = '';

  if (
    normalized === 'ACTIVE' || 
    normalized === 'APPROVED' || 
    normalized === 'VERIFIED' || 
    normalized === 'COMPLETED' || 
    normalized === 'PAID'
  ) {
    styles = 'bg-primary-fixed text-primary border border-primary';
    icon = 'verified';
  } else if (
    normalized === 'PENDING' || 
    normalized === 'PENDING_APPROVAL' || 
    normalized === 'ISSUED' || 
    normalized === 'SUBMITTED' || 
    normalized === 'OPEN'
  ) {
    styles = 'bg-secondary-fixed text-secondary border border-secondary';
    icon = 'pending';
  } else if (
    normalized === 'INACTIVE' || 
    normalized === 'REJECTED' || 
    normalized === 'BLACKLISTED' || 
    normalized === 'OVERDUE' || 
    normalized === 'CLOSED'
  ) {
    styles = 'bg-error-container text-error border border-error';
    icon = 'block';
  }

  return (
    <span className={`inline-flex items-center gap-xs px-sm py-1 rounded-full text-[11px] font-bold uppercase tracking-tight ${styles}`}>
      {icon && (
        <span 
          className="material-symbols-outlined text-[14px]" 
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      )}
      {status}
    </span>
  );
};

export default StatusBadge;
