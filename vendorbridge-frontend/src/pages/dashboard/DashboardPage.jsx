import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getSummary, getAnalytics, getRecentRFQs, getRecentPurchaseOrders, getRecentInvoices } from '../../api/dashboardApi';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { usePermissions } from '../../hooks/usePermissions';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { role, isProcurementOfficer, isManager, isVendor } = usePermissions();

  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: getSummary
  });

  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['dashboardAnalytics'],
    queryFn: getAnalytics
  });

  const { data: recentRFQs, isLoading: isRFQsLoading } = useQuery({
    queryKey: ['recentRFQs'],
    queryFn: getRecentRFQs
  });

  const { data: recentPOs, isLoading: isPOsLoading } = useQuery({
    queryKey: ['recentPOs'],
    queryFn: getRecentPurchaseOrders
  });

  const { data: recentInvoices, isLoading: isInvoicesLoading } = useQuery({
    queryKey: ['recentInvoices'],
    queryFn: getRecentInvoices
  });

  const isLoading = isSummaryLoading || isAnalyticsLoading || isRFQsLoading || isPOsLoading || isInvoicesLoading;

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // Curated color palette
  const COLORS = ['#745b00', '#84540f', '#f3ca4a', '#5f5e5e'];

  return (
    <div className="space-y-lg">
      {/* Header */}
      <div className="flex justify-between items-end flex-wrap gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Executive Dashboard</h2>
          <p className="text-tertiary">Real-time procurement insights and vendor metrics ({role}).</p>
        </div>
        <div className="flex gap-md flex-wrap">
          <button className="px-md py-sm border border-outline text-on-surface rounded-lg hover:bg-surface-container transition-colors flex items-center gap-xs">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            Last 30 Days
          </button>
          <button className="px-md py-sm bg-primary-container text-on-primary-container font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-xs">
            <span className="material-symbols-outlined text-sm">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-md">
        {/* Total Vendors */}
        <div className="bg-surface p-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-on-surface-variant font-label-md text-label-md">Total Vendors</span>
            <span className="p-xs bg-surface-container rounded-lg material-symbols-outlined text-primary">storefront</span>
          </div>
          <div>
            <div className="font-headline-md text-headline-md">{summary?.totalVendors}</div>
            <div className="text-label-sm text-green-600 flex items-center gap-xs">
              <span className="material-symbols-outlined text-xs">trending_up</span> +12% vs LY
            </div>
          </div>
        </div>

        {/* Active RFQs */}
        <div className="bg-surface p-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-on-surface-variant font-label-md text-label-md">Active RFQs</span>
            <span className="p-xs bg-surface-container rounded-lg material-symbols-outlined text-secondary">request_quote</span>
          </div>
          <div>
            <div className="font-headline-md text-headline-md">{summary?.activeRFQs}</div>
            <div className="text-label-sm text-on-surface-variant">8 closing today</div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-surface p-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-on-surface-variant font-label-md text-label-md">Approvals</span>
            <span className="p-xs bg-surface-container rounded-lg material-symbols-outlined text-error">fact_check</span>
          </div>
          <div>
            <div className="font-headline-md text-headline-md">{summary?.pendingApprovals}</div>
            <div className="text-label-sm text-error flex items-center gap-xs">
              <span className="material-symbols-outlined text-xs">priority_high</span> 3 High Priority
            </div>
          </div>
        </div>

        {/* Total Spend */}
        <div className="bg-surface p-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-on-surface-variant font-label-md text-label-md">Total Spend</span>
            <span className="p-xs bg-surface-container rounded-lg material-symbols-outlined text-primary">payments</span>
          </div>
          <div>
            <div className="font-headline-md text-headline-md font-label-md">{formatCurrency(summary?.totalSpend)}</div>
            <div className="text-label-sm text-on-surface-variant">YTD Performance</div>
          </div>
        </div>

        {/* Open Invoices */}
        <div className="bg-surface p-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-on-surface-variant font-label-md text-label-md">Open Invoices</span>
            <span className="p-xs bg-surface-container rounded-lg material-symbols-outlined text-secondary">receipt</span>
          </div>
          <div>
            <div className="font-headline-md text-headline-md">{summary?.openInvoices}</div>
            <div className="text-label-sm text-on-tertiary-fixed-variant font-label-sm">{formatCurrency(summary?.outstandingAmount)} Outstanding</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Monthly Procurement Trend */}
        <div className="lg:col-span-2 bg-surface p-lg rounded-xl border border-outline-variant shadow-sm">
          <h3 className="font-headline-sm text-headline-sm mb-lg">Monthly Procurement Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.monthlyProcurement}>
                <XAxis dataKey="month" stroke="#7f7663" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="#7f7663" fontSize={11} fontFamily="JetBrains Mono" />
                <Tooltip />
                <Legend />
                <Bar dataKey="spend" name="Spend ($)" fill="#745b00" radius={[4, 4, 0, 0]} />
                <Bar dataKey="volume" name="Volume (qty)" fill="#f3ca4a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending Summary Donut */}
        <div className="bg-surface p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <h3 className="font-headline-sm text-headline-sm mb-lg">Spending Summary</h3>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.spendingSummary}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics?.spendingSummary?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-sm mt-md font-body-sm text-xs">
            {analytics?.spendingSummary?.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-xs">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Details Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Recent Invoices & PO lists */}
        <div className="lg:col-span-2 bg-surface p-lg rounded-xl border border-outline-variant shadow-sm space-y-lg">
          <div>
            <h3 className="font-headline-sm text-headline-sm mb-md">Recent Transactions</h3>
            <div className="border border-outline-variant rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="px-md py-sm font-label-sm text-on-surface-variant uppercase text-xs">Doc Number</th>
                    <th className="px-md py-sm font-label-sm text-on-surface-variant uppercase text-xs">Partner</th>
                    <th className="px-md py-sm font-label-sm text-on-surface-variant uppercase text-xs">Amount</th>
                    <th className="px-md py-sm font-label-sm text-on-surface-variant uppercase text-xs">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant font-body-sm">
                  {recentPOs?.slice(0, 3).map((po) => (
                    <tr key={po.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-md py-sm font-label-md">{po.po_number}</td>
                      <td className="px-md py-sm font-semibold">{po.vendor_name}</td>
                      <td className="px-md py-sm font-label-sm">{formatCurrency(po.total_amount)}</td>
                      <td className="px-md py-sm">
                        <StatusBadge status={po.status} />
                      </td>
                    </tr>
                  ))}
                  {recentInvoices?.slice(0, 3).map((inv) => (
                    <tr key={inv.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-md py-sm font-label-md">{inv.invoice_number}</td>
                      <td className="px-md py-sm font-semibold">{inv.vendor_name}</td>
                      <td className="px-md py-sm font-label-sm">{formatCurrency(inv.total_amount)}</td>
                      <td className="px-md py-sm">
                        <StatusBadge status={inv.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-surface p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-headline-sm text-headline-sm mb-lg">Quick Actions</h3>
            <div className="space-y-md">
              {isProcurementOfficer && (
                <button
                  onClick={() => navigate('/rfqs/create')}
                  className="w-full flex items-center justify-between p-md bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-md">
                    <div className="p-sm bg-primary-container text-on-primary-container rounded-lg">
                      <span className="material-symbols-outlined">request_quote</span>
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">Create RFQ</p>
                      <p className="text-xs text-on-surface-variant">Request for Quotation</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              )}

              {isManager && (
                <button
                  onClick={() => navigate('/approvals')}
                  className="w-full flex items-center justify-between p-md bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-md">
                    <div className="p-sm bg-error-container text-error rounded-lg">
                      <span className="material-symbols-outlined">fact_check</span>
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">Pending Approvals</p>
                      <p className="text-xs text-on-surface-variant">Review supplier bids</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              )}

              {isVendor && (
                <button
                  onClick={() => navigate('/quotations/submit')}
                  className="w-full flex items-center justify-between p-md bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-md">
                    <div className="p-sm bg-secondary-container text-on-secondary-container rounded-lg">
                      <span className="material-symbols-outlined">description</span>
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">Submit Quotation</p>
                      <p className="text-xs text-on-surface-variant">Respond to active RFQs</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              )}

              <button
                onClick={() => navigate('/vendors')}
                className="w-full flex items-center justify-between p-md bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-md">
                  <div className="p-sm bg-surface-container text-on-surface rounded-lg">
                    <span className="material-symbols-outlined">storefront</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">Supplier Directory</p>
                    <p className="text-xs text-on-surface-variant">View verified partners</p>
                  </div>
                </div>
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="mt-lg rounded-xl overflow-hidden h-28 relative">
            <img
              alt="Procurement desk"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3lmOUy9Lb0QI2M6NugUPWiwsVGUOlHCTQ5fm0sGw_GzPDE32vPLcRxJ1N6137XkzRydWWxw3I-e96CG4MuJsy24oJJz1zRsSVJ_aS--xXFPCWbcmWMgVis5nOxMtlOlfq9OIWwvaArOa6MhDGN8PlqWmTlxJDh17Q1Z_XSB8KkKX9uex8r32a1_jXmcTPOudyT_X9X2SN1AjVWwP5YmVRGI_2IbgXeIbm_NhHXFrK3lwzJ2ITYHpZ8V1m9gpRmMEWsckqbLcdaKTv"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dim to-transparent opacity-60"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
