import api from './axios';

export const getSummary = async () => {
  try {
    const res = await api.get('/api/dashboard/summary');
    return res.data;
  } catch (err) {
    if (!err.response) {
      return {
        totalVendors: 1284,
        activeRFQs: 42,
        pendingApprovals: 15,
        totalSpend: 4200000,
        openInvoices: 108,
        outstandingAmount: 284000
      };
    }
    throw new Error(err.response?.data?.message || 'Failed to fetch summary.');
  }
};

export const getAnalytics = async () => {
  try {
    const res = await api.get('/api/dashboard/analytics');
    return res.data;
  } catch (err) {
    if (!err.response) {
      return {
        monthlyProcurement: [
          { month: 'Jan', spend: 240000, volume: 12 },
          { month: 'Feb', spend: 310000, volume: 15 },
          { month: 'Mar', spend: 280000, volume: 14 },
          { month: 'Apr', spend: 420000, volume: 22 },
          { month: 'May', spend: 350000, volume: 18 },
          { month: 'Jun', spend: 480000, volume: 25 },
          { month: 'Jul', spend: 510000, volume: 28 },
          { month: 'Aug', spend: 460000, volume: 20 },
          { month: 'Sep', spend: 490000, volume: 21 },
          { month: 'Oct', spend: 520000, volume: 24 },
          { month: 'Nov', spend: 580000, volume: 27 },
          { month: 'Dec', spend: 640000, volume: 30 }
        ],
        spendingSummary: [
          { name: 'Raw Materials', value: 2100000, color: '#745b00' },
          { name: 'Logistics', value: 950000, color: '#84540f' },
          { name: 'Electronics', value: 850000, color: '#f3ca4a' },
          { name: 'Office Supplies', value: 300000, color: '#5f5e5e' }
        ]
      };
    }
    throw new Error(err.response?.data?.message || 'Failed to fetch analytics.');
  }
};

export const getRecentRFQs = async () => {
  try {
    const res = await api.get('/api/dashboard/recent-rfqs');
    return res.data;
  } catch (err) {
    if (!err.response) {
      return [
        { id: 1, rfq_number: 'RFQ-2024-0012', title: 'High-Grade Steel Sheets Procurement', deadline: '2024-06-20', status: 'OPEN' },
        { id: 2, rfq_number: 'RFQ-2024-0015', title: 'Microchip Components - Q3 Production', deadline: '2024-06-25', status: 'OPEN' },
        { id: 3, rfq_number: 'RFQ-2024-0008', title: 'Office Desks and Ergonomic Chairs', deadline: '2024-05-15', status: 'CLOSED' }
      ];
    }
    throw new Error(err.response?.data?.message || 'Failed to fetch recent RFQs.');
  }
};

export const getRecentPurchaseOrders = async () => {
  try {
    const res = await api.get('/api/dashboard/recent-purchase-orders');
    return res.data;
  } catch (err) {
    if (!err.response) {
      return [
        { id: 1, po_number: 'PO-4412', vendor_name: 'Blue Sky Supplies', total_amount: 4500, status: 'ISSUED', created_at: '2024-05-03' },
        { id: 2, po_number: 'PO-4408', vendor_name: 'Global Dynamics Inc.', total_amount: 14500, status: 'COMPLETED', created_at: '2024-04-18' }
      ];
    }
    throw new Error(err.response?.data?.message || 'Failed to fetch recent POs.');
  }
};

export const getRecentInvoices = async () => {
  try {
    const res = await api.get('/api/dashboard/recent-invoices');
    return res.data;
  } catch (err) {
    if (!err.response) {
      return [
        { id: 1, invoice_number: 'INV-2024-0412', vendor_name: 'Blue Sky Supplies', total_amount: 5310, status: 'GENERATED', generated_at: '2024-05-05' },
        { id: 2, invoice_number: 'INV-2024-0398', vendor_name: 'Global Dynamics Inc.', total_amount: 17110, status: 'PAID', generated_at: '2024-04-20' }
      ];
    }
    throw new Error(err.response?.data?.message || 'Failed to fetch recent invoices.');
  }
};
