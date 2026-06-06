import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';

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

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Vendors (Admin & Procurement Officer) */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'PROCUREMENT_OFFICER']} />}>
              <Route path="/vendors" element={<VendorListPage />} />
              <Route path="/vendors/add" element={<VendorFormPage />} />
              <Route path="/vendors/edit/:id" element={<VendorFormPage />} />
              <Route path="/vendors/:id" element={<VendorDetailPage />} />
            </Route>

            {/* RFQs */}
            <Route path="/rfqs" element={<RFQListPage />} />
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'PROCUREMENT_OFFICER']} />}>
              <Route path="/rfqs/create" element={<RFQCreatePage />} />
            </Route>
            <Route path="/rfqs/:id" element={<RFQDetailPage />} />

            {/* Quotations */}
            <Route path="/quotations" element={<QuotationListPage />} />
            <Route element={<ProtectedRoute allowedRoles={['VENDOR', 'ADMIN']} />}>
              <Route path="/quotations/submit" element={<QuotationFormPage />} />
              <Route path="/quotations/submit/:rfqId" element={<QuotationFormPage />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'PROCUREMENT_OFFICER']} />}>
              <Route path="/quotations/compare/:rfqId" element={<QuotationComparePage />} />
            </Route>

            {/* Approvals (Manager & Admin) */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'MANAGER/APPROVER', 'APPROVER']} />}>
              <Route path="/approvals" element={<ApprovalPage />} />
            </Route>

            {/* Purchase Orders */}
            <Route path="/purchase-orders" element={<POListPage />} />
            <Route path="/purchase-orders/:id" element={<PODetailPage />} />

            {/* Invoices */}
            <Route path="/invoices" element={<InvoiceListPage />} />
            <Route path="/invoices/:id" element={<InvoiceDetailPage />} />

            {/* Reports (Admin, Officer & Manager) */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'MANAGER/APPROVER', 'APPROVER']} />}>
              <Route path="/reports" element={<ReportsPage />} />
            </Route>

            {/* Activity Logs (Admin only) */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/activity" element={<ActivityLogsPage />} />
            </Route>

            {/* User Management (Admin only) */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
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
