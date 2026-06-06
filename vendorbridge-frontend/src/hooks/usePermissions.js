import { useAuth } from './useAuth';

export const usePermissions = () => {
  const { role, isAuthenticated } = useAuth();

  const normalizedRole = (role || '').toUpperCase();

  const isAdmin = normalizedRole === 'ADMIN';
  const isProcurementOfficer = normalizedRole === 'PROCUREMENT_OFFICER';
  const isVendor = normalizedRole === 'VENDOR' || normalizedRole === 'VENDOR_MANAGER';
  const isManager = normalizedRole === 'MANAGER' || normalizedRole === 'APPROVER';

  const canAccessUserManagement = isAdmin;
  const canManageVendors = isAdmin || isProcurementOfficer;
  const canCreateRFQ = isProcurementOfficer || isAdmin;
  const canCompareQuotations = isProcurementOfficer || isAdmin;
  const canSubmitQuotation = isVendor;
  const canApproveQuotation = isManager || isAdmin;
  const canGeneratePO = isProcurementOfficer || isAdmin;
  const canManageInvoices = isProcurementOfficer || isAdmin;

  return {
    role,
    isAuthenticated,
    isAdmin,
    isProcurementOfficer,
    isVendor,
    isManager,
    canAccessUserManagement,
    canManageVendors,
    canCreateRFQ,
    canCompareQuotations,
    canSubmitQuotation,
    canApproveQuotation,
    canGeneratePO,
    canManageInvoices,
  };
};
