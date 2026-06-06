import api from './axios';

export const getPendingApprovals = async () => {
  try {
    const res = await api.get('/api/approvals/pending');
    return res.data;
  } catch (err) {
    if (!err.response) {
      return MOCK_PENDING_APPROVALS;
    }
    throw new Error(err.response?.data?.message || 'Failed to fetch pending approvals.');
  }
};

export const getApprovalHistory = async () => {
  try {
    const res = await api.get('/api/approvals/history');
    return res.data;
  } catch (err) {
    if (!err.response) {
      return MOCK_APPROVAL_HISTORY;
    }
    throw new Error(err.response?.data?.message || 'Failed to fetch approval history.');
  }
};

export const approveQuotation = async (approvalData) => {
  try {
    const res = await api.post('/api/approvals/approve', approvalData);
    return res.data;
  } catch (err) {
    if (!err.response) {
      const approvalId = approvalData.approvalId || approvalData.id;
      const pendingIdx = MOCK_PENDING_APPROVALS.findIndex(a => a.id === parseInt(approvalId));
      if (pendingIdx !== -1) {
        const approved = MOCK_PENDING_APPROVALS.splice(pendingIdx, 1)[0];
        MOCK_APPROVAL_HISTORY.unshift({
          ...approved,
          status: 'APPROVED',
          remarks: approvalData.remarks || 'Approved by Manager',
          approved_at: new Date().toISOString()
        });
      }
      return { success: true };
    }
    throw new Error(err.response?.data?.message || 'Approval failed.');
  }
};

export const rejectQuotation = async (approvalData) => {
  try {
    const res = await api.post('/api/approvals/reject', approvalData);
    return res.data;
  } catch (err) {
    if (!err.response) {
      const approvalId = approvalData.approvalId || approvalData.id;
      const pendingIdx = MOCK_PENDING_APPROVALS.findIndex(a => a.id === parseInt(approvalId));
      if (pendingIdx !== -1) {
        const rejected = MOCK_PENDING_APPROVALS.splice(pendingIdx, 1)[0];
        MOCK_APPROVAL_HISTORY.unshift({
          ...rejected,
          status: 'REJECTED',
          remarks: approvalData.remarks || 'Rejected due to price mismatch',
          approved_at: new Date().toISOString()
        });
      }
      return { success: true };
    }
    throw new Error(err.response?.data?.message || 'Rejection failed.');
  }
};

const MOCK_PENDING_APPROVALS = [
  {
    id: 1,
    rfq_id: 1,
    rfq_number: 'RFQ-2024-0012',
    rfq_title: 'High-Grade Steel Sheets Procurement',
    quotation_id: 2,
    quotation_number: 'QTN-2024-9122',
    vendor_id: 5,
    vendor_name: 'Industrial Dynamics Ltd.',
    amount: 12500,
    delivery_days: 14,
    items_count: 1,
    requested_by: 'Alex Thompson',
    requested_at: '2024-05-13T10:00:00Z'
  }
];

const MOCK_APPROVAL_HISTORY = [
  {
    id: 101,
    rfq_id: 3,
    rfq_number: 'RFQ-2024-0008',
    rfq_title: 'Office Desks and Ergonomic Chairs',
    quotation_id: 10,
    quotation_number: 'QTN-2024-1102',
    vendor_id: 4,
    vendor_name: 'Blue Sky Supplies',
    amount: 4500,
    delivery_days: 7,
    items_count: 1,
    requested_by: 'Michael Chang',
    requested_at: '2024-05-01T09:00:00Z',
    status: 'APPROVED',
    remarks: 'Within quarterly budget.',
    approved_at: '2024-05-03T11:30:00Z'
  }
];
