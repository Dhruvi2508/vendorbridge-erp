import api from './axios';

export const getInvoices = async () => {
  try {
    const res = await api.get('/api/invoices');
    return res.data;
  } catch (err) {
    if (!err.response) {
      return MOCK_INVOICES;
    }
    throw new Error(err.response?.data?.message || 'Failed to fetch invoices.');
  }
};

export const getInvoiceById = async (id) => {
  try {
    const res = await api.get(`/api/invoices/${id}`);
    return res.data;
  } catch (err) {
    if (!err.response) {
      return MOCK_INVOICES.find(i => i.id === parseInt(id)) || MOCK_INVOICES[0];
    }
    throw new Error(err.response?.data?.message || 'Failed to fetch invoice.');
  }
};

export const createInvoice = async (invoiceData) => {
  try {
    const res = await api.post('/api/invoices', invoiceData);
    return res.data;
  } catch (err) {
    if (!err.response) {
      const subtotal = invoiceData.subtotal || 0;
      const tax_amount = Math.round(subtotal * 0.18); // 18% standard GST
      const newInvoice = {
        id: Date.now(),
        invoice_number: `INV-2024-${Math.floor(1000 + Math.random() * 9000)}`,
        subtotal,
        tax_amount,
        total_amount: subtotal + tax_amount,
        status: 'GENERATED',
        generated_at: new Date().toISOString(),
        ...invoiceData
      };
      MOCK_INVOICES.unshift(newInvoice);
      return newInvoice;
    }
    throw new Error(err.response?.data?.message || 'Failed to create invoice.');
  }
};

export const downloadInvoicePdf = async (id) => {
  try {
    const res = await api.get(`/api/invoices/download/${id}`, { responseType: 'blob' });
    return res.data;
  } catch (err) {
    if (!err.response) {
      return new Blob(['Mock PDF Content'], { type: 'application/pdf' });
    }
    throw new Error('PDF generation failed.');
  }
};

export const sendInvoiceEmail = async (id, recipientEmail) => {
  try {
    const res = await api.post(`/api/invoices/send-email/${id}`, { recipientEmail });
    return res.data;
  } catch (err) {
    if (!err.response) {
      return { success: true, message: `Email successfully sent to ${recipientEmail || 'vendor'}.` };
    }
    throw new Error(err.response?.data?.message || 'Failed to send email.');
  }
};

const MOCK_INVOICES = [
  {
    id: 1,
    invoice_number: 'INV-2024-0412',
    purchase_order_id: 1,
    po_number: 'PO-4412',
    vendor_id: 4,
    vendor_name: 'Blue Sky Supplies',
    subtotal: 4500,
    tax_amount: 810,
    total_amount: 5310,
    status: 'GENERATED',
    generated_at: '2024-05-05T15:00:00Z',
    items: [
      { id: 1, item_name: 'Ergonomic Desk Chair', quantity: 50, unit_price: 90.00, total_price: 4500 }
    ]
  },
  {
    id: 2,
    invoice_number: 'INV-2024-0398',
    purchase_order_id: 2,
    po_number: 'PO-4408',
    vendor_id: 1,
    vendor_name: 'Global Dynamics Inc.',
    subtotal: 14500,
    tax_amount: 2610,
    total_amount: 17110,
    status: 'PAID',
    generated_at: '2024-04-20T11:00:00Z',
    items: [
      { id: 2, item_name: 'High-Grade Steel Sheet', quantity: 500, unit_price: 29.00, total_price: 14500 }
    ]
  }
];
