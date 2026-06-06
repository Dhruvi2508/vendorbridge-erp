import api from './axios';

export const getNotifications = async () => {
  try {
    const res = await api.get('/api/notifications');
    return res.data;
  } catch (err) {
    if (!err.response) {
      return MOCK_NOTIFICATIONS;
    }
    throw new Error(err.response?.data?.message || 'Failed to fetch notifications.');
  }
};

export const markAsRead = async (id) => {
  try {
    const res = await api.put(`/api/notifications/read/${id}`);
    return res.data;
  } catch (err) {
    if (!err.response) {
      const notif = MOCK_NOTIFICATIONS.find(n => n.id === parseInt(id));
      if (notif) {
        notif.is_read = true;
      }
      return { success: true };
    }
    throw new Error(err.response?.data?.message || 'Failed to mark notification as read.');
  }
};

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'New Quotation Received', message: 'Vendor Steel Fabricators Inc. submitted a quote for RFQ-2024-0012.', is_read: false, created_at: '2026-06-06T09:10:00Z' },
  { id: 2, title: 'PO #4412 Approved', message: 'Procurement Manager approved PO for Industrial Dynamics Ltd.', is_read: false, created_at: '2026-06-06T06:10:00Z' },
  { id: 3, title: 'Price Variance Warning', message: '15% price increase detected in latest invoice from Global Logistics Corp.', is_read: false, created_at: '2026-06-05T16:15:00Z' },
  { id: 4, title: 'New RFQ Created', message: 'RFQ-2024-0015 Microchip Components has been created successfully.', is_read: true, created_at: '2026-06-05T14:30:00Z' }
];
