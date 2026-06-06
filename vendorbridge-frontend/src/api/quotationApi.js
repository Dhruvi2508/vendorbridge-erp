import api from './axios';

export const getQuotations = async () => {
  try {
    const res = await api.get('/api/quotations');
    return res.data;
  } catch (err) {
    if (!err.response) {
      return MOCK_QUOTATIONS;
    }
    throw new Error(err.response?.data?.message || 'Failed to fetch quotations.');
  }
};

export const getQuotationById = async (id) => {
  try {
    const res = await api.get(`/api/quotations/${id}`);
    return res.data;
  } catch (err) {
    if (!err.response) {
      return MOCK_QUOTATIONS.find(q => q.id === parseInt(id)) || MOCK_QUOTATIONS[0];
    }
    throw new Error(err.response?.data?.message || 'Failed to fetch quotation.');
  }
};

export const getQuotationsByRFQ = async (rfqId) => {
  try {
    const res = await api.get(`/api/quotations/rfq/${rfqId}`);
    return res.data;
  } catch (err) {
    if (!err.response) {
      return MOCK_QUOTATIONS.filter(q => q.rfq_id === parseInt(rfqId));
    }
    throw new Error(err.response?.data?.message || 'Failed to fetch RFQ quotations.');
  }
};

export const getQuotationCompare = async (rfqId) => {
  try {
    const res = await api.get(`/api/quotations/compare/${rfqId}`);
    return res.data;
  } catch (err) {
    if (!err.response) {
      return MOCK_QUOTATIONS.filter(q => q.rfq_id === parseInt(rfqId)).map(q => ({
        ...q,
        vendor_name: q.vendor_id === 1 ? 'Global Dynamics Inc.' : q.vendor_id === 5 ? 'Industrial Dynamics Ltd.' : 'Swift Logistics Solutions',
        rating: q.vendor_id === 1 ? 4.6 : q.vendor_id === 5 ? 4.8 : 3.9
      }));
    }
    throw new Error(err.response?.data?.message || 'Failed to fetch comparison.');
  }
};

export const createQuotation = async (quotationData) => {
  try {
    const res = await api.post('/api/quotations', quotationData);
    return res.data;
  } catch (err) {
    if (!err.response) {
      const newQuo = {
        id: Date.now(),
        quotation_number: `QTN-2024-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'SUBMITTED',
        submitted_at: new Date().toISOString(),
        ...quotationData
      };
      MOCK_QUOTATIONS.push(newQuo);
      return newQuo;
    }
    throw new Error(err.response?.data?.message || 'Failed to submit quotation.');
  }
};

export const updateQuotation = async (id, quotationData) => {
  try {
    const res = await api.put(`/api/quotations/${id}`, quotationData);
    return res.data;
  } catch (err) {
    if (!err.response) {
      const idx = MOCK_QUOTATIONS.findIndex(q => q.id === parseInt(id));
      if (idx !== -1) {
        MOCK_QUOTATIONS[idx] = { ...MOCK_QUOTATIONS[idx], ...quotationData };
        return MOCK_QUOTATIONS[idx];
      }
      return { id, ...quotationData };
    }
    throw new Error(err.response?.data?.message || 'Failed to update quotation.');
  }
};

export const deleteQuotation = async (id) => {
  try {
    const res = await api.delete(`/api/quotations/${id}`);
    return res.data;
  } catch (err) {
    if (!err.response) {
      const idx = MOCK_QUOTATIONS.findIndex(q => q.id === parseInt(id));
      if (idx !== -1) MOCK_QUOTATIONS.splice(idx, 1);
      return { success: true };
    }
    throw new Error(err.response?.data?.message || 'Failed to delete quotation.');
  }
};

const MOCK_QUOTATIONS = [
  {
    id: 1,
    quotation_number: 'QTN-2024-8891',
    rfq_id: 1,
    vendor_id: 1,
    vendor_name: 'Global Dynamics Inc.',
    total_amount: 14500,
    delivery_days: 10,
    notes: 'Premium structural steel. Standard warranty applies.',
    status: 'SUBMITTED',
    submitted_at: '2024-05-10T09:00:00Z',
    items: [
      { id: 1, item_name: 'High-Grade Steel Sheet', quantity: 500, unit_price: 29.00, total_price: 14500 }
    ]
  },
  {
    id: 2,
    quotation_number: 'QTN-2024-9122',
    rfq_id: 1,
    vendor_id: 5,
    vendor_name: 'Industrial Dynamics Ltd.',
    total_amount: 12500,
    delivery_days: 14,
    notes: 'Factory direct sheets, ISO certified. Discounted price.',
    status: 'SUBMITTED',
    submitted_at: '2024-05-12T14:00:00Z',
    items: [
      { id: 2, item_name: 'High-Grade Steel Sheet', quantity: 500, unit_price: 25.00, total_price: 12500 }
    ]
  }
];
