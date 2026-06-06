import api from './axios';

export const getPurchaseOrders = async () => {
  try {
    const res = await api.get('/api/purchase-orders');
    return res.data;
  } catch (err) {
    if (!err.response) {
      return MOCK_POS;
    }
    throw new Error(err.response?.data?.message || 'Failed to fetch purchase orders.');
  }
};

export const getPurchaseOrderById = async (id) => {
  try {
    const res = await api.get(`/api/purchase-orders/${id}`);
    return res.data;
  } catch (err) {
    if (!err.response) {
      return MOCK_POS.find(p => p.id === parseInt(id)) || MOCK_POS[0];
    }
    throw new Error(err.response?.data?.message || 'Failed to fetch PO.');
  }
};

export const createPurchaseOrder = async (poData) => {
  try {
    const res = await api.post('/api/purchase-orders', poData);
    return res.data;
  } catch (err) {
    if (!err.response) {
      const newPO = {
        id: Date.now(),
        po_number: `PO-44${Math.floor(10 + Math.random() * 89)}`,
        status: 'DRAFT',
        created_at: new Date().toISOString(),
        ...poData
      };
      MOCK_POS.unshift(newPO);
      return newPO;
    }
    throw new Error(err.response?.data?.message || 'Failed to create PO.');
  }
};

export const updatePurchaseOrder = async (id, poData) => {
  try {
    const res = await api.put(`/api/purchase-orders/${id}`, poData);
    return res.data;
  } catch (err) {
    if (!err.response) {
      const idx = MOCK_POS.findIndex(p => p.id === parseInt(id));
      if (idx !== -1) {
        MOCK_POS[idx] = { ...MOCK_POS[idx], ...poData };
        return MOCK_POS[idx];
      }
      return { id, ...poData };
    }
    throw new Error(err.response?.data?.message || 'Failed to update PO.');
  }
};

const MOCK_POS = [
  {
    id: 1,
    po_number: 'PO-4412',
    quotation_id: 10,
    vendor_id: 4,
    vendor_name: 'Blue Sky Supplies',
    total_amount: 4500,
    status: 'ISSUED',
    created_at: '2024-05-03T12:00:00Z',
    items: [
      { id: 1, item_name: 'Ergonomic Desk Chair', quantity: 50, unit_price: 90.00, total_price: 4500 }
    ]
  },
  {
    id: 2,
    po_number: 'PO-4408',
    quotation_id: 1,
    vendor_id: 1,
    vendor_name: 'Global Dynamics Inc.',
    total_amount: 14500,
    status: 'COMPLETED',
    created_at: '2024-04-18T10:30:00Z',
    items: [
      { id: 2, item_name: 'High-Grade Steel Sheet', quantity: 500, unit_price: 29.00, total_price: 14500 }
    ]
  }
];
