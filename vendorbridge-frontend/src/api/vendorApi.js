import api from './axios';

export const getVendors = async () => {
  try {
    const res = await api.get('/api/vendors');
    return res.data;
  } catch (err) {
    if (!err.response) {
      return MOCK_VENDORS;
    }
    throw new Error(err.response?.data?.message || 'Failed to fetch vendors.');
  }
};

export const searchVendors = async (query) => {
  try {
    const res = await api.get(`/api/vendors/search?query=${query}`);
    return res.data;
  } catch (err) {
    if (!err.response) {
      if (!query) return MOCK_VENDORS;
      return MOCK_VENDORS.filter(v => 
        v.company_name.toLowerCase().includes(query.toLowerCase()) ||
        v.gst_number.toLowerCase().includes(query.toLowerCase())
      );
    }
    throw new Error(err.response?.data?.message || 'Failed to search vendors.');
  }
};

export const getVendorById = async (id) => {
  try {
    const res = await api.get(`/api/vendors/${id}`);
    return res.data;
  } catch (err) {
    if (!err.response) {
      return MOCK_VENDORS.find(v => v.id === parseInt(id)) || MOCK_VENDORS[0];
    }
    throw new Error(err.response?.data?.message || 'Failed to fetch vendor.');
  }
};

export const createVendor = async (vendorData) => {
  try {
    const res = await api.post('/api/vendors', vendorData);
    return res.data;
  } catch (err) {
    if (!err.response) {
      const category = MOCK_CATEGORIES.find(c => c.id === parseInt(vendorData.category_id))?.category_name || 'General';
      const newVendor = {
        id: Date.now(),
        vendor_code: `VND-${Math.floor(1000 + Math.random() * 9000)}`,
        rating: 5,
        status: 'Pending',
        category,
        created_at: new Date().toISOString(),
        ...vendorData
      };
      MOCK_VENDORS.push(newVendor);
      return newVendor;
    }
    throw new Error(err.response?.data?.message || 'Failed to create vendor.');
  }
};

export const updateVendor = async (id, vendorData) => {
  try {
    const res = await api.put(`/api/vendors/${id}`, vendorData);
    return res.data;
  } catch (err) {
    if (!err.response) {
      const idx = MOCK_VENDORS.findIndex(v => v.id === parseInt(id));
      if (idx !== -1) {
        if (vendorData.category_id) {
          const category = MOCK_CATEGORIES.find(c => c.id === parseInt(vendorData.category_id))?.category_name || MOCK_VENDORS[idx].category;
          MOCK_VENDORS[idx].category = category;
        }
        MOCK_VENDORS[idx] = { ...MOCK_VENDORS[idx], ...vendorData };
        return MOCK_VENDORS[idx];
      }
      return { id, ...vendorData };
    }
    throw new Error(err.response?.data?.message || 'Failed to update vendor.');
  }
};

export const deleteVendor = async (id) => {
  try {
    const res = await api.delete(`/api/vendors/${id}`);
    return res.data;
  } catch (err) {
    if (!err.response) {
      const idx = MOCK_VENDORS.findIndex(v => v.id === parseInt(id));
      if (idx !== -1) MOCK_VENDORS.splice(idx, 1);
      return { success: true };
    }
    throw new Error(err.response?.data?.message || 'Failed to delete vendor.');
  }
};

export const getCategories = async () => {
  try {
    const res = await api.get('/api/vendor-categories');
    return res.data;
  } catch (err) {
    if (!err.response) {
      return MOCK_CATEGORIES;
    }
    throw new Error(err.response?.data?.message || 'Failed to fetch categories.');
  }
};

export const createCategory = async (catData) => {
  try {
    const res = await api.post('/api/vendor-categories', catData);
    return res.data;
  } catch (err) {
    if (!err.response) {
      const newCat = { id: Date.now(), ...catData };
      MOCK_CATEGORIES.push(newCat);
      return newCat;
    }
    throw new Error(err.response?.data?.message || 'Failed to create category.');
  }
};

const MOCK_CATEGORIES = [
  { id: 1, category_name: 'Raw Materials', description: 'Metals, steel sheets, plastics' },
  { id: 2, category_name: 'Logistics', description: 'Delivery, freight forwarding, trucking' },
  { id: 3, category_name: 'Electronics', description: 'Microchips, wiring harnesses, PCBs' },
  { id: 4, category_name: 'Office Supplies', description: 'Stationery, computers, chairs' }
];

const MOCK_VENDORS = [
  { id: 1, vendor_code: 'VND-4812', company_name: 'Global Dynamics Inc.', gst_number: '03AAACG4125G1Z9', contact_person: 'Harpreet Singh', email: 'harpreet@globaldynamics.com', phone: '+91 98765-43210', address: 'Plot 45, Focal Point, Ludhiana, Punjab', category_id: 1, category: 'Raw Materials', rating: 4.6, status: 'Verified', created_at: '2024-01-15T10:00:00Z' },
  { id: 2, vendor_code: 'VND-2901', company_name: 'Swift Logistics Solutions', gst_number: '27AADCS2920M1Z2', contact_person: 'Rajesh Sharma', email: 'rajesh@swiftlogistics.com', phone: '+91 91234-56789', address: '102, Sakinaka Link Road, Mumbai, Maharashtra', category_id: 2, category: 'Logistics', rating: 3.9, status: 'Pending', created_at: '2024-02-18T14:30:00Z' },
  { id: 3, vendor_code: 'VND-3341', company_name: 'Alpha Electronics Ltd.', gst_number: '29AAACK1234K1Z5', contact_person: 'Ananya Rao', email: 'ananya@alphaelectronics.in', phone: '+91 80567-12345', address: 'Tech Park phase-2, Electronic City, Bengaluru, Karnataka', category_id: 3, category: 'Electronics', rating: 3.2, status: 'Blacklisted', created_at: '2024-03-10T11:00:00Z' },
  { id: 4, vendor_code: 'VND-7712', company_name: 'Blue Sky Supplies', gst_number: '06AAACH5678Q1Z1', contact_person: 'Amit Verma', email: 'amit@bluesky.com', phone: '+91 99887-76655', address: 'Sec-14, Industrial Area, Gurgaon, Haryana', category_id: 4, category: 'Office Supplies', rating: 4.2, status: 'Verified', created_at: '2024-03-25T16:00:00Z' },
  { id: 5, vendor_code: 'VND-9905', company_name: 'Industrial Dynamics Ltd.', gst_number: '03BBBCG1234F1Z0', contact_person: 'Baldev Singh', email: 'baldev@inddyn.com', phone: '+91 98111-22233', address: 'Ludhiana, Punjab', category_id: 1, category: 'Raw Materials', rating: 4.8, status: 'Verified', created_at: '2024-04-01T09:00:00Z' }
];
