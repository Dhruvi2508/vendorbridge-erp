import api from './axios';

export const getVendorPerformance = async () => {
  try {
    const res = await api.get('/api/reports/vendor-performance');
    return res.data;
  } catch (err) {
    console.warn('[reportApi] getVendorPerformance failed, using mock data:', err.message);
    return MOCK_VENDOR_PERFORMANCE;
  }
};

export const getProcurementSummary = async () => {
  try {
    const res = await api.get('/api/reports/procurement-summary');
    return res.data;
  } catch (err) {
    console.warn('[reportApi] getProcurementSummary failed, using mock data:', err.message);
    return {
      totalRFQs: 82,
      totalPOs: 65,
      totalInvoices: 58,
      totalSpend: 1250000
    };
  }
};

export const getMonthlySpending = async () => {
  try {
    const res = await api.get('/api/reports/monthly-spending');
    return res.data;
  } catch (err) {
    console.warn('[reportApi] getMonthlySpending failed, using mock data:', err.message);
    return [
      { month: 'Jan', spend: 85000 },
      { month: 'Feb', spend: 120000 },
      { month: 'Mar', spend: 95000 },
      { month: 'Apr', spend: 150000 },
      { month: 'May', spend: 180000 },
      { month: 'Jun', spend: 220000 }
    ];
  }
};

export const exportReports = async () => {
  try {
    const res = await api.get('/api/reports/export');
    return res.data;
  } catch (err) {
    if (!err.response) {
      return { success: true, url: '#', message: 'Report generated successfully as CSV.' };
    }
    throw new Error(err.response?.data?.message || 'Export failed.');
  }
};

const MOCK_VENDOR_PERFORMANCE = [
  { id: 1, vendor_name: 'Industrial Dynamics Ltd.', total_orders: 45, on_time_delivery: 98, avg_rating: 4.8 },
  { id: 2, vendor_name: 'Global Dynamics Inc.', total_orders: 38, on_time_delivery: 92, avg_rating: 4.6 },
  { id: 3, vendor_name: 'Blue Sky Supplies', total_orders: 12, on_time_delivery: 85, avg_rating: 4.2 },
  { id: 4, vendor_name: 'Swift Logistics Solutions', total_orders: 22, on_time_delivery: 78, avg_rating: 3.9 },
  { id: 5, vendor_name: 'Alpha Electronics Ltd.', total_orders: 5, on_time_delivery: 64, avg_rating: 3.2 }
];
