import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import toast from 'react-hot-toast';
import { getVendorPerformance, getProcurementSummary, getMonthlySpending, exportReports } from '../../api/reportApi';
import PageWrapper from '../../components/layout/PageWrapper';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DataTable from '../../components/common/DataTable';
import { formatCurrency } from '../../utils/formatters';

const ReportsPage = () => {
  const { data: performance = [], isLoading: isPerfLoading } = useQuery({
    queryKey: ['vendorPerformance'],
    queryFn: getVendorPerformance
  });

  const { data: summary, isLoading: isSumLoading } = useQuery({
    queryKey: ['procurementSummary'],
    queryFn: getProcurementSummary
  });

  const { data: monthlySpending = [], isLoading: isSpendLoading } = useQuery({
    queryKey: ['monthlySpending'],
    queryFn: getMonthlySpending
  });

  const exportMutation = useMutation({
    mutationFn: exportReports,
    onSuccess: () => {
      toast.success('Report successfully compiled and exported as CSV!');
    },
    onError: () => toast.error('Export compiled report failed.')
  });

  const isLoading = isPerfLoading || isSumLoading || isSpendLoading;

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  const perfColumns = [
    { header: 'Vendor Name', accessor: 'vendor_name', render: (row) => <span className="font-semibold">{row.vendor_name}</span> },
    { header: 'Total Orders', accessor: 'total_orders', align: 'right' },
    { header: 'On-Time Delivery %', accessor: 'on_time_delivery', align: 'right', render: (row) => <span className="font-bold text-green-700">{row.on_time_delivery}%</span> },
    {
      header: 'Average Rating',
      accessor: 'avg_rating',
      render: (row) => (
        <div className="flex items-center gap-xs text-amber-500 font-bold">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          {row.avg_rating}
        </div>
      )
    }
  ];

  return (
    <PageWrapper
      title="Reports & Analytics Dashboard"
      description="Review monthly spend matrices, compile vendor compliance, and download operational spreadsheets."
      actions={
        <button
          onClick={() => exportMutation.mutate()}
          className="bg-primary-container text-on-primary-container font-semibold px-lg py-md rounded-lg flex items-center gap-md btn-primary-shadow hover:opacity-90 active:scale-95 transition-all w-full sm:w-auto justify-center"
        >
          <span className="material-symbols-outlined">download</span>
          Export Operational Sheets
        </button>
      }
    >
      {/* KPI Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-md mt-md">
        <div className="bg-surface p-md rounded-xl border border-outline-variant card-shadow">
          <span className="text-on-surface-variant font-label-sm text-xs uppercase block">Cumulative Spend</span>
          <span className="font-headline-md text-headline-md text-primary font-label-md block mt-xs">{formatCurrency(summary?.totalSpend)}</span>
        </div>
        <div className="bg-surface p-md rounded-xl border border-outline-variant card-shadow">
          <span className="text-on-surface-variant font-label-sm text-xs uppercase block">Total RFQs Bidded</span>
          <span className="font-headline-md text-headline-md text-on-surface block mt-xs">{summary?.totalRFQs}</span>
        </div>
        <div className="bg-surface p-md rounded-xl border border-outline-variant card-shadow">
          <span className="text-on-surface-variant font-label-sm text-xs uppercase block">Purchase Orders Issued</span>
          <span className="font-headline-md text-headline-md text-on-surface block mt-xs">{summary?.totalPOs}</span>
        </div>
        <div className="bg-surface p-md rounded-xl border border-outline-variant card-shadow">
          <span className="text-on-surface-variant font-label-sm text-xs uppercase block">Invoices Cleared</span>
          <span className="font-headline-md text-headline-md text-on-surface block mt-xs">{summary?.totalInvoices}</span>
        </div>
      </div>

      {/* Monthly Spending Trend Chart */}
      <div className="bg-surface p-lg rounded-xl border border-outline-variant card-shadow mt-lg">
        <h3 className="font-headline-sm text-headline-sm mb-lg">Monthly Spending Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlySpending}>
              <XAxis dataKey="month" stroke="#7f7663" fontSize={11} fontFamily="JetBrains Mono" />
              <YAxis stroke="#7f7663" fontSize={11} fontFamily="JetBrains Mono" />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="spend" name="Monthly Cost ($)" stroke="#745b00" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vendor performance rankings */}
      <div className="mt-lg">
        <h3 className="font-headline-sm text-headline-sm mb-md">Vendor Performance Index</h3>
        <DataTable columns={perfColumns} data={performance} />
      </div>
    </PageWrapper>
  );
};

export default ReportsPage;
