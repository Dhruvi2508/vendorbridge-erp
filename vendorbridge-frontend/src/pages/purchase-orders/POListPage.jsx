import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getPurchaseOrders } from '../../api/purchaseOrderApi';
import PageWrapper from '../../components/layout/PageWrapper';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

const POListPage = () => {
  const navigate = useNavigate();

  const { data: pos = [], isLoading } = useQuery({
    queryKey: ['purchaseOrders'],
    queryFn: getPurchaseOrders
  });

  const columns = [
    { header: 'PO Number', accessor: 'po_number', render: (row) => <span className="font-label-md">{row.po_number}</span> },
    { header: 'Vendor Name', accessor: 'vendor_name', render: (row) => <span className="font-semibold">{row.vendor_name}</span> },
    { header: 'Total Amount', accessor: 'total_amount', render: (row) => <span className="font-label-sm font-semibold">{formatCurrency(row.total_amount)}</span> },
    { header: 'Created Date', accessor: 'created_at', render: (row) => <span className="font-label-sm text-xs">{formatDate(row.created_at)}</span> },
    { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Actions',
      accessor: 'id',
      align: 'right',
      render: (row) => (
        <div className="flex justify-end gap-sm">
          <button
            onClick={() => navigate(`/purchase-orders/${row.id}`)}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-high transition-colors text-on-surface-variant"
            title="View Details"
          >
            <span className="material-symbols-outlined text-[20px]">visibility</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <PageWrapper
      title="Purchase Orders"
      description={`Manage auto-drafted procurement orders and review supplier deliverables across ${pos.length} logs.`}
    >
      <div className="mt-md">
        <DataTable columns={columns} data={pos} isLoading={isLoading} />
      </div>
    </PageWrapper>
  );
};

export default POListPage;
