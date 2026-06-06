export const APP_ROLES = {
  ADMIN: 'ADMIN',
  PROCUREMENT_OFFICER: 'PROCUREMENT_OFFICER',
  VENDOR: 'VENDOR',
  MANAGER: 'MANAGER',
  APPROVER: 'APPROVER',
  VENDOR_MANAGER: 'VENDOR_MANAGER',
};

export const normalizeRole = (role) => {
  const normalized = (role || '').toUpperCase();

  if (normalized === 'MANAGER/APPROVER') {
    return 'APPROVER';
  }

  return normalized;
};

export const getDashboardPathForRole = (role) => {
  switch (normalizeRole(role)) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'PROCUREMENT_OFFICER':
      return '/procurement/dashboard';
    case 'VENDOR':
    case 'VENDOR_MANAGER':
      return '/vendor/dashboard';
    case 'MANAGER':
    case 'APPROVER':
      return '/manager/dashboard';
    default:
      return '/login';
  }
};

export const getRoleLabel = (role) => {
  switch (normalizeRole(role)) {
    case 'ADMIN':
      return 'Admin';
    case 'PROCUREMENT_OFFICER':
      return 'Procurement Officer';
    case 'VENDOR':
    case 'VENDOR_MANAGER':
      return 'Vendor';
    case 'MANAGER':
    case 'APPROVER':
      return 'Manager / Approver';
    default:
      return 'User';
  }
};

export const getSidebarMenuItems = (role) => {
  const normalizedRole = normalizeRole(role);

  const sharedDashboard = [{ path: getDashboardPathForRole(normalizedRole), label: 'Dashboard', icon: 'dashboard' }];

  const menusByRole = {
    ADMIN: [
      ...sharedDashboard,
      { path: '/users', label: 'User Management', icon: 'group' },
      { path: '/vendors', label: 'Vendor Management', icon: 'storefront' },
      { path: '/reports', label: 'Analytics', icon: 'analytics' },
      { path: '/activity', label: 'Audit Logs', icon: 'history' },
    ],
    PROCUREMENT_OFFICER: [
      ...sharedDashboard,
      { path: '/rfqs', label: 'RFQ Management', icon: 'request_quote' },
      { path: '/quotations', label: 'Quotation Comparison', icon: 'description' },
      { path: '/purchase-orders', label: 'Purchase Orders', icon: 'shopping_cart' },
      { path: '/invoices', label: 'Invoices', icon: 'receipt' },
    ],
    VENDOR: [
      ...sharedDashboard,
      { path: '/rfqs', label: 'Assigned RFQs', icon: 'request_quote' },
      { path: '/quotations/submit', label: 'Submit Quotations', icon: 'edit_note' },
      { path: '/purchase-orders', label: 'Purchase Orders', icon: 'shopping_cart' },
    ],
    VENDOR_MANAGER: [
      ...sharedDashboard,
      { path: '/rfqs', label: 'Assigned RFQs', icon: 'request_quote' },
      { path: '/quotations/submit', label: 'Submit Quotations', icon: 'edit_note' },
      { path: '/purchase-orders', label: 'Purchase Orders', icon: 'shopping_cart' },
    ],
    MANAGER: [
      ...sharedDashboard,
      { path: '/approvals?tab=pending', label: 'Pending Approvals', icon: 'fact_check' },
      { path: '/approvals?tab=history', label: 'Approval History', icon: 'history' },
      { path: '/reports', label: 'Workflow Monitoring', icon: 'monitoring' },
    ],
  };

  return menusByRole[normalizedRole] || sharedDashboard;
};

export const getDashboardConfig = (role) => {
  const normalizedRole = normalizeRole(role);

  return {
    ADMIN: {
      title: 'Admin Dashboard',
      subtitle: 'Govern users, vendors, and enterprise-wide visibility.',
      accent: 'from-slate-900 via-slate-800 to-amber-700',
      stats: [
        { label: 'Users', value: '248', trend: '+6%' },
        { label: 'Vendors', value: '1,284', trend: '+12%' },
        { label: 'Open Requests', value: '87', trend: '+4%' },
        { label: 'System Health', value: '99.9%', trend: 'Stable' },
      ],
      quickActions: [
        { label: 'Manage Users', path: '/users', icon: 'group' },
        { label: 'Review Vendors', path: '/vendors', icon: 'storefront' },
        { label: 'View Analytics', path: '/reports', icon: 'analytics' },
      ],
    },
    PROCUREMENT_OFFICER: {
      title: 'Procurement Dashboard',
      subtitle: 'Run RFQs, compare quotes, and issue orders faster.',
      accent: 'from-amber-900 via-yellow-800 to-orange-700',
      stats: [
        { label: 'Active RFQs', value: '42', trend: '8 due today' },
        { label: 'Pending Quotes', value: '118', trend: '+18%' },
        { label: 'Purchase Orders', value: '76', trend: '14 new' },
        { label: 'Invoices', value: '23', trend: 'Awaiting review' },
      ],
      quickActions: [
        { label: 'Create RFQ', path: '/rfqs/create', icon: 'request_quote' },
        { label: 'Compare Quotations', path: '/quotations', icon: 'compare_arrows' },
        { label: 'Generate PO', path: '/purchase-orders', icon: 'shopping_cart' },
      ],
    },
    VENDOR: {
      title: 'Vendor Dashboard',
      subtitle: 'Track assigned RFQs and submit quotations on time.',
      accent: 'from-emerald-900 via-teal-800 to-cyan-700',
      stats: [
        { label: 'Assigned RFQs', value: '18', trend: '5 closing soon' },
        { label: 'Draft Quotes', value: '7', trend: '2 pending edits' },
        { label: 'Awarded Orders', value: '29', trend: '+3 this month' },
        { label: 'Response SLA', value: '94%', trend: 'Healthy' },
      ],
      quickActions: [
        { label: 'View RFQs', path: '/rfqs', icon: 'request_quote' },
        { label: 'Submit Quote', path: '/quotations/submit', icon: 'upload_file' },
        { label: 'Purchase Orders', path: '/purchase-orders', icon: 'shopping_cart' },
      ],
    },
    VENDOR_MANAGER: {
      title: 'Vendor Dashboard',
      subtitle: 'Track assigned RFQs and submit quotations on time.',
      accent: 'from-emerald-900 via-teal-800 to-cyan-700',
      stats: [
        { label: 'Assigned RFQs', value: '18', trend: '5 closing soon' },
        { label: 'Draft Quotes', value: '7', trend: '2 pending edits' },
        { label: 'Awarded Orders', value: '29', trend: '+3 this month' },
        { label: 'Response SLA', value: '94%', trend: 'Healthy' },
      ],
      quickActions: [
        { label: 'View RFQs', path: '/rfqs', icon: 'request_quote' },
        { label: 'Submit Quote', path: '/quotations/submit', icon: 'upload_file' },
        { label: 'Purchase Orders', path: '/purchase-orders', icon: 'shopping_cart' },
      ],
    },
    MANAGER: {
      title: 'Manager Dashboard',
      subtitle: 'Approve procurement requests and monitor workflow health.',
      accent: 'from-slate-900 via-indigo-900 to-violet-700',
      stats: [
        { label: 'Pending Approvals', value: '15', trend: '4 urgent' },
        { label: 'Approved Today', value: '31', trend: '+9%' },
        { label: 'Blocked Requests', value: '6', trend: 'Needs action' },
        { label: 'Workflow Score', value: '96%', trend: 'On track' },
      ],
      quickActions: [
        { label: 'Review Approvals', path: '/approvals?tab=pending', icon: 'fact_check' },
        { label: 'Approval History', path: '/approvals?tab=history', icon: 'history' },
        { label: 'Monitor Workflow', path: '/reports', icon: 'monitoring' },
      ],
    },
  }[normalizedRole] || {
    title: 'Dashboard',
    subtitle: 'Role-based operational overview.',
    accent: 'from-slate-900 via-slate-800 to-amber-700',
    stats: [],
    quickActions: [],
  };
};
