import { format } from 'date-fns';

export const formatCurrency = (amount) => {
  if (amount == null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString, formatPattern = 'MMM dd, yyyy') => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), formatPattern);
  } catch (err) {
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  return formatDate(dateString, 'MMM dd, yyyy hh:mm a');
};
