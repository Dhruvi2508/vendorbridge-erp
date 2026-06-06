import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleGuard from '../components/rbac/RoleGuard';
import DashboardRedirect from '../components/rbac/DashboardRedirect';
import AccessDeniedPage from '../components/rbac/AccessDeniedPage';
import DashboardLayout from '../components/layout/DashboardLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AdminDashboardPage from '../pages/dashboards/AdminDashboardPage';
import ProcurementDashboardPage from '../pages/dashboards/ProcurementDashboardPage';
import VendorDashboardPage from '../pages/dashboards/VendorDashboardPage';
import ManagerDashboardPage from '../pages/dashboards/ManagerDashboardPage';

// Lazy load pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const SignupPage = lazy(() => import('../pages/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));

const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const VendorListPage = lazy(() => import('../pages/vendors/VendorListPage'));
const VendorFormPage = lazy(() => import('../pages/vendors/VendorFormPage'));
const VendorDetailPage = lazy(() => import('../pages/vendors/VendorDetailPage'));

const RFQListPage = lazy(() => import('../pages/rfq/RFQListPage'));
const RFQCreatePage = lazy(() => import('../pages/rfq/RFQCreatePage'));
const RFQDetailPage = lazy(() => import('../pages/rfq/RFQDetailPage'));

const QuotationListPage = lazy(() => import('../pages/quotations/QuotationListPage'));
const QuotationFormPage = lazy(() => import('../pages/quotations/QuotationFormPage'));
const QuotationComparePage = lazy(() => import('../pages/quotations/QuotationComparePage'));

const ApprovalPage = lazy(() => import('../pages/approvals/ApprovalPage'));

const POListPage = lazy(() => import('../pages/purchase-orders/POListPage'));
const PODetailPage = lazy(() => import('../pages/purchase-orders/PODetailPage'));

const InvoiceListPage = lazy(() => import('../pages/invoices/InvoiceListPage'));
const InvoiceDetailPage = lazy(() => import('../pages/invoices/InvoiceDetailPage'));

const ReportsPage = lazy(() => import('../pages/reports/ReportsPage'));
const ActivityLogsPage = lazy(() => import('../pages/activity/ActivityLogsPage'));
const UserManagementPage = lazy(() => import('../pages/users/UserManagementPage'));

const VendorDashboardWrapper = () => <VendorDashboardPage />;
const AdminDashboardWrapper = () => <AdminDashboardPage />;
const ProcurementDashboardWrapper = () => <ProcurementDashboardPage />;
const ManagerDashboardWrapper = () => <ManagerDashboardPage />;

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/403" element={<AccessDeniedPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardRedirect />} />

            <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboardWrapper />} />
            </Route>

            <Route element={<RoleGuard allowedRoles={['PROCUREMENT_OFFICER']} />}>
              <Route path="/procurement/dashboard" element={<ProcurementDashboardWrapper />} />
            </Route>

            <Route element={<RoleGuard allowedRoles={['VENDOR', 'VENDOR_MANAGER']} />}>
              <Route path="/vendor/dashboard" element={<VendorDashboardWrapper />} />
            </Route>

            <Route element={<RoleGuard allowedRoles={['MANAGER', 'APPROVER']} />}>
              <Route path="/manager/dashboard" element={<ManagerDashboardWrapper />} />
            </Route>
            
            {/* Vendors (Admin & Procurement Officer) */}
            <Route element={<RoleGuard allowedRoles={['ADMIN', 'PROCUREMENT_OFFICER']} />}>
              <Route path="/vendors" element={<VendorListPage />} />
              <Route path="/vendors/add" element={<VendorFormPage />} />
              <Route path="/vendors/edit/:id" element={<VendorFormPage />} />
              <Route path="/vendors/:id" element={<VendorDetailPage />} />
            </Route>

            {/* RFQs */}
            <Route element={<RoleGuard allowedRoles={['ADMIN', 'PROCUREMENT_OFFICER', 'VENDOR', 'VENDOR_MANAGER']} />}>
              <Route path="/rfqs" element={<RFQListPage />} />
            </Route>
            <Route element={<RoleGuard allowedRoles={['ADMIN', 'PROCUREMENT_OFFICER']} />}>
              <Route path="/rfqs/create" element={<RFQCreatePage />} />
            </Route>
            <Route element={<RoleGuard allowedRoles={['ADMIN', 'PROCUREMENT_OFFICER', 'VENDOR', 'VENDOR_MANAGER']} />}>
              <Route path="/rfqs/:id" element={<RFQDetailPage />} />
            </Route>

            {/* Quotations */}
            <Route element={<RoleGuard allowedRoles={['ADMIN', 'PROCUREMENT_OFFICER', 'VENDOR', 'VENDOR_MANAGER']} />}>
              <Route path="/quotations" element={<QuotationListPage />} />
            </Route>
            <Route element={<RoleGuard allowedRoles={['VENDOR', 'ADMIN']} />}>
              <Route path="/quotations/submit" element={<QuotationFormPage />} />
              <Route path="/quotations/submit/:rfqId" element={<QuotationFormPage />} />
            </Route>
            <Route element={<RoleGuard allowedRoles={['ADMIN', 'PROCUREMENT_OFFICER']} />}>
              <Route path="/quotations/compare/:rfqId" element={<QuotationComparePage />} />
            </Route>

            {/* Approvals (Manager & Admin) */}
            <Route element={<RoleGuard allowedRoles={['ADMIN', 'MANAGER', 'APPROVER']} />}>
              <Route path="/approvals" element={<ApprovalPage />} />
            </Route>

            {/* Purchase Orders */}
            <Route element={<RoleGuard allowedRoles={['ADMIN', 'PROCUREMENT_OFFICER', 'VENDOR', 'MANAGER', 'APPROVER', 'VENDOR_MANAGER']} />}>
              <Route path="/purchase-orders" element={<POListPage />} />
              <Route path="/purchase-orders/:id" element={<PODetailPage />} />
            </Route>

            {/* Invoices */}
            <Route element={<RoleGuard allowedRoles={['ADMIN', 'PROCUREMENT_OFFICER']} />}>
              <Route path="/invoices" element={<InvoiceListPage />} />
              <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
            </Route>

            {/* Reports (Admin, Officer & Manager) */}
            <Route element={<RoleGuard allowedRoles={['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'APPROVER']} />}>
              <Route path="/reports" element={<ReportsPage />} />
            </Route>

            {/* Activity Logs (Admin only) */}
            <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
              <Route path="/activity" element={<ActivityLogsPage />} />
            </Route>

            {/* User Management (Admin only) */}
            <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
              <Route path="/users" element={<UserManagementPage />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
