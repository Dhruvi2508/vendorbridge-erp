import api from './axios';

export const getRFQs = async () => {
  try {
    const res = await api.get('/api/rfqs');
    return res.data;
  } catch (err) {
    if (!err.response) {
      return MOCK_RFQS;
    }
    throw new Error(err.response?.data?.message || 'Failed to fetch RFQs.');
  }
};

export const getRFQById = async (id) => {
  try {
    const res = await api.get(`/api/rfqs/${id}`);
    return res.data;
  } catch (err) {
    if (!err.response) {
      return MOCK_RFQS.find(r => r.id === parseInt(id)) || MOCK_RFQS[0];
    }
    throw new Error(err.response?.data?.message || 'Failed to fetch RFQ.');
  }
};

export const createRFQ = async (rfqData) => {
  try {
    const res = await api.post('/api/rfqs', rfqData);
    return res.data;
  } catch (err) {
    if (!err.response) {
      const newRFQ = {
        id: Date.now(),
        rfq_number: `RFQ-2024-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'OPEN',
        created_by: 'Alex Thompson',
        created_at: new Date().toISOString(),
        items: rfqData.items || [],
        vendors: rfqData.vendors || [],
        ...rfqData
      };
      MOCK_RFQS.unshift(newRFQ);
      return newRFQ;
    }
    throw new Error(err.response?.data?.message || 'Failed to create RFQ.');
  }
};

export const updateRFQ = async (id, rfqData) => {
  try {
    const res = await api.put(`/api/rfqs/${id}`, rfqData);
    return res.data;
  } catch (err) {
    if (!err.response) {
      const idx = MOCK_RFQS.findIndex(r => r.id === parseInt(id));
      if (idx !== -1) {
        MOCK_RFQS[idx] = { ...MOCK_RFQS[idx], ...rfqData };
        return MOCK_RFQS[idx];
      }
      return { id, ...rfqData };
    }
    throw new Error(err.response?.data?.message || 'Failed to update RFQ.');
  }
};

export const deleteRFQ = async (id) => {
  try {
    const res = await api.delete(`/api/rfqs/${id}`);
    return res.data;
  } catch (err) {
    if (!err.response) {
      const idx = MOCK_RFQS.findIndex(r => r.id === parseInt(id));
      if (idx !== -1) MOCK_RFQS.splice(idx, 1);
      return { success: true };
    }
    throw new Error(err.response?.data?.message || 'Failed to delete RFQ.');
  }
};

export const assignVendor = async (id, vendorId) => {
  try {
    const res = await api.post(`/api/rfqs/${id}/assign-vendor`, { vendorId });
    return res.data;
  } catch (err) {
    if (!err.response) {
      const rfq = MOCK_RFQS.find(r => r.id === parseInt(id));
      if (rfq && !rfq.vendors.includes(parseInt(vendorId))) {
        rfq.vendors.push(parseInt(vendorId));
      }
      return { success: true };
    }
    throw new Error(err.response?.data?.message || 'Failed to assign vendor.');
  }
};

export const uploadRFQAttachment = async (id, formData) => {
  try {
    const res = await api.post(`/api/rfqs/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  } catch (err) {
    if (!err.response) {
      const rfq = MOCK_RFQS.find(r => r.id === parseInt(id));
      if (rfq) {
        if (!rfq.attachments) rfq.attachments = [];
        rfq.attachments.push({
          id: Date.now(),
          file_name: formData.get('file')?.name || 'specification.pdf',
          file_path: '/uploads/specification.pdf'
        });
      }
      return { success: true };
    }
    throw new Error(err.response?.data?.message || 'Failed to upload attachment.');
  }
};

const MOCK_RFQS = [
  {
    id: 1,
    rfq_number: 'RFQ-2024-0012',
    title: 'High-Grade Steel Sheets Procurement',
    description: 'Procurement of 500 units of high-grade steel sheets for chassis fabrication.',
    deadline: '2024-06-20',
    status: 'OPEN',
    created_by: 'Alex Thompson',
    created_at: '2024-05-01T10:00:00Z',
    items: [
      { id: 1, item_name: 'High-Grade Steel Sheet', description: 'Thickness 4mm, size 2mx1m', quantity: 500, unit: 'Sheets' }
    ],
    vendors: [1, 5],
    attachments: [
      { id: 1, file_name: 'Steel_Specs_v2.pdf', file_path: '/uploads/Steel_Specs_v2.pdf' }
    ]
  },
  {
    id: 2,
    rfq_number: 'RFQ-2024-0015',
    title: 'Microchip Components - Q3 Production',
    description: 'Sourcing microcontrollers and PCB connectors for the electronics division.',
    deadline: '2024-06-25',
    status: 'OPEN',
    created_by: 'Alex Thompson',
    created_at: '2024-05-05T14:30:00Z',
    items: [
      { id: 2, item_name: 'MCU-32bit-A', description: '32-bit Microcontroller 48MHz', quantity: 2000, unit: 'Units' },
      { id: 3, item_name: 'PCB Connector 8-pin', description: 'Right angle board-to-board connector', quantity: 5000, unit: 'Units' }
    ],
    vendors: [3],
    attachments: []
  },
  {
    id: 3,
    rfq_number: 'RFQ-2024-0008',
    title: 'Office Desks and Ergonomic Chairs',
    description: 'Renovation furniture for the corporate head office.',
    deadline: '2024-05-15',
    status: 'CLOSED',
    created_by: 'Michael Chang',
    created_at: '2024-04-10T11:00:00Z',
    items: [
      { id: 4, item_name: 'Ergonomic Desk Chair', description: 'Mesh back, adjustable armrest', quantity: 50, unit: 'Units' }
    ],
    vendors: [4],
    attachments: []
  }
];
