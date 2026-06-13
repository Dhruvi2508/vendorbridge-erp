import api from './axios';

export const normalizeVendor = (vendor) => {
  if (!vendor) {
    return vendor;
  }

  const categoryName = vendor.category_name || vendor.category?.categoryName || vendor.category?.category_name || vendor.categoryName || '';
  const categoryId = vendor.category_id || vendor.category?.id || vendor.categoryId || null;
  // Backend returns VendorStatus enum as string (e.g. "PENDING", "VERIFIED")
  const status = vendor.status || vendor.vendor_status || vendor.vendorStatus || null;
  // Normalize status to title-case for StatusBadge compatibility (e.g. VERIFIED -> Verified)
  const statusDisplay = status ? (status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()) : null;

  return {
    ...vendor,
    id: vendor.id,
    vendor_code: vendor.vendor_code || vendor.vendorCode || '',
    vendorCode: vendor.vendor_code || vendor.vendorCode || '',
    company_name: vendor.company_name || vendor.companyName || '',
    companyName: vendor.company_name || vendor.companyName || '',
    contact_person: vendor.contact_person || vendor.contactPerson || '',
    contactPerson: vendor.contact_person || vendor.contactPerson || '',
    email: vendor.email || '',
    phone: vendor.phone || '',
    alternate_phone: vendor.alternate_phone || vendor.alternatePhone || '',
    alternatePhone: vendor.alternate_phone || vendor.alternatePhone || '',
    website: vendor.website || '',
    address: vendor.address || '',
    city: vendor.city || '',
    state: vendor.state || '',
    country: vendor.country || '',
    postal_code: vendor.postal_code || vendor.postalCode || '',
    postalCode: vendor.postal_code || vendor.postalCode || '',
    tax_id: vendor.tax_id || vendor.taxId || '',
    taxId: vendor.tax_id || vendor.taxId || '',
    gst_number: vendor.gst_number || vendor.gstNumber || '',
    gstNumber: vendor.gst_number || vendor.gstNumber || '',
    pan_number: vendor.pan_number || vendor.panNumber || '',
    panNumber: vendor.pan_number || vendor.panNumber || '',
    bank_name: vendor.bank_name || vendor.bankName || '',
    bankName: vendor.bank_name || vendor.bankName || '',
    bank_account_number: vendor.bank_account_number || vendor.bankAccountNumber || '',
    bankAccountNumber: vendor.bank_account_number || vendor.bankAccountNumber || '',
    bank_ifsc_code: vendor.bank_ifsc_code || vendor.bankIfscCode || '',
    bankIfscCode: vendor.bank_ifsc_code || vendor.bankIfscCode || '',
    status: statusDisplay,
    rating: vendor.rating ?? 0,
    notes: vendor.notes || '',
    category_id: categoryId,
    categoryId,
    category_name: categoryName,
    categoryName,
    category: vendor.category
      ? {
          ...vendor.category,
          categoryName: categoryName,
          category_name: categoryName,
        }
      : { id: categoryId, categoryName, category_name: categoryName },
  };
};

export const isAssignableVendor = (vendor) => {
  const status = (vendor?.status || '').toString().trim().toUpperCase();
  return ['ACTIVE', 'VERIFIED', 'APPROVED', 'PENDING_APPROVAL'].includes(status);
};

export const getVendors = async () => {
  try {
    const res = await api.get('/api/vendors');
    return Array.isArray(res.data) ? res.data.map(normalizeVendor) : [];
  } catch (err) {
    console.warn('[vendorApi] getVendors failed, using mock data:', err.message);
    return MOCK_VENDORS.map(normalizeVendor);
  }
};

export const searchVendors = async (query) => {
  try {
    const res = await api.get(`/api/vendors/search?query=${query}`);
    return Array.isArray(res.data) ? res.data.map(normalizeVendor) : [];
  } catch (err) {
    console.warn('[vendorApi] searchVendors failed, using mock data:', err.message);
    if (!query) return MOCK_VENDORS.map(normalizeVendor);
    return MOCK_VENDORS.map(normalizeVendor).filter(v =>
      v.company_name.toLowerCase().includes(query.toLowerCase()) ||
      v.gst_number.toLowerCase().includes(query.toLowerCase())
    );
  }
};

export const getVendorById = async (id) => {
  try {
    const res = await api.get(`/api/vendors/${id}`);
    return normalizeVendor(res.data);
  } catch (err) {
    console.warn('[vendorApi] getVendorById failed, using mock data:', err.message);
    return normalizeVendor(MOCK_VENDORS.find(v => v.id === parseInt(id)) || MOCK_VENDORS[0]);
  }
};

export const createVendor = async (vendorData) => {
  try {
    // Map frontend snake_case form fields to backend camelCase VendorRequest
    const vendorCode = vendorData.vendor_code || vendorData.vendorCode || `VND-${Math.floor(1000 + Math.random() * 9000)}`;
    const payload = {
      vendorCode,
      companyName: vendorData.company_name || vendorData.companyName || '',
      contactPerson: vendorData.contact_person || vendorData.contactPerson || '',
      email: vendorData.email || '',
      phone: vendorData.phone || '',
      alternatePhone: vendorData.alternate_phone || vendorData.alternatePhone || '',
      website: vendorData.website || '',
      address: vendorData.address || '',
      city: vendorData.city || '',
      state: vendorData.state || '',
      country: vendorData.country || '',
      postalCode: vendorData.postal_code || vendorData.postalCode || '',
      taxId: vendorData.tax_id || vendorData.taxId || '',
      gstNumber: vendorData.gst_number || vendorData.gstNumber || '',
      panNumber: vendorData.pan_number || vendorData.panNumber || '',
      bankName: vendorData.bank_name || vendorData.bankName || '',
      bankAccountNumber: vendorData.bank_account_number || vendorData.bankAccountNumber || '',
      bankIfscCode: vendorData.bank_ifsc_code || vendorData.bankIfscCode || '',
      status: 'PENDING',
      rating: vendorData.rating || null,
      notes: vendorData.notes || '',
      categoryId: parseInt(vendorData.category_id || vendorData.categoryId) || null,
    };
    const res = await api.post('/api/vendors', payload);
    return normalizeVendor(res.data);
  } catch (err) {
    if (!err.response) {
      const catId = parseInt(vendorData.category_id || vendorData.categoryId);
      const categoryObj = MOCK_CATEGORIES.find(c => c.id === catId);
      const newVendor = {
        id: Date.now(),
        vendor_code: vendorData.vendor_code || `VND-${Math.floor(1000 + Math.random() * 9000)}`,
        rating: 5,
        status: 'Pending',
        category: categoryObj?.category_name || 'General',
        category_id: catId,
        created_at: new Date().toISOString(),
        ...vendorData
      };
      MOCK_VENDORS.push(newVendor);
      return normalizeVendor(newVendor);
    }
    throw new Error(err.response?.data?.message || 'Failed to create vendor.');
  }
};

export const updateVendor = async (id, vendorData) => {
  try {
    // Map frontend snake_case form fields to backend camelCase VendorRequest
    const existing = MOCK_VENDORS.find(v => v.id === parseInt(id));
    const vendorCode = vendorData.vendor_code || vendorData.vendorCode || existing?.vendor_code || `VND-${id}`;
    const payload = {
      vendorCode,
      companyName: vendorData.company_name || vendorData.companyName || '',
      contactPerson: vendorData.contact_person || vendorData.contactPerson || '',
      email: vendorData.email || '',
      phone: vendorData.phone || '',
      alternatePhone: vendorData.alternate_phone || vendorData.alternatePhone || '',
      website: vendorData.website || '',
      address: vendorData.address || '',
      city: vendorData.city || '',
      state: vendorData.state || '',
      country: vendorData.country || '',
      postalCode: vendorData.postal_code || vendorData.postalCode || '',
      taxId: vendorData.tax_id || vendorData.taxId || '',
      gstNumber: vendorData.gst_number || vendorData.gstNumber || '',
      panNumber: vendorData.pan_number || vendorData.panNumber || '',
      bankName: vendorData.bank_name || vendorData.bankName || '',
      bankAccountNumber: vendorData.bank_account_number || vendorData.bankAccountNumber || '',
      bankIfscCode: vendorData.bank_ifsc_code || vendorData.bankIfscCode || '',
      status: vendorData.status ? vendorData.status.toUpperCase() : 'PENDING',
      rating: vendorData.rating || null,
      notes: vendorData.notes || '',
      categoryId: parseInt(vendorData.category_id || vendorData.categoryId) || null,
    };
    const res = await api.put(`/api/vendors/${id}`, payload);
    return normalizeVendor(res.data);
  } catch (err) {
    if (!err.response) {
      const idx = MOCK_VENDORS.findIndex(v => v.id === parseInt(id));
      if (idx !== -1) {
        if (vendorData.category_id) {
          const category = MOCK_CATEGORIES.find(c => c.id === parseInt(vendorData.category_id))?.category_name || MOCK_VENDORS[idx].category;
          MOCK_VENDORS[idx].category = category;
        }
        MOCK_VENDORS[idx] = { ...MOCK_VENDORS[idx], ...vendorData };
        return normalizeVendor(MOCK_VENDORS[idx]);
      }
      return normalizeVendor({ id, ...vendorData });
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
    return Array.isArray(res.data)
      ? res.data.map((category) => ({
          ...category,
          category_name: category.category_name || category.categoryName || '',
          categoryName: category.categoryName || category.category_name || '',
        }))
      : [];
  } catch (err) {
    console.warn('[vendorApi] getCategories failed, using mock data:', err.message);
    return MOCK_CATEGORIES.map((category) => ({
      ...category,
      category_name: category.category_name || category.categoryName || '',
      categoryName: category.categoryName || category.category_name || '',
    }));
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
