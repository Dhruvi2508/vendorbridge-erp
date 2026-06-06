import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getInvoices } from '../../api/invoiceApi';
import PageWrapper from '../../components/layout/PageWrapper';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

const InvoiceListPage = () => {
  const navigate = useNavigate();

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: getInvoices
  });

  const columns = [
    { header: 'Invoice Number', accessor: 'invoice_number', render: (row) => <span className="font-label-md">{row.invoice_number}</span> },
    { header: 'PO Reference', accessor: 'po_number', render: (row) => <span className="font-label-md">{row.po_number || `PO #${row.purchase_order_id}`}</span> },
    { header: 'Vendor Name', accessor: 'vendor_name', render: (row) => <span className="font-semibold">{row.vendor_name}</span> },
    { header: 'Total Value', accessor: 'total_amount', render: (row) => <span className="font-label-sm font-semibold">{formatCurrency(row.total_amount)}</span> },
    { header: 'Generated Date', accessor: 'generated_at', render: (row) => <span className="font-label-sm text-xs">{formatDate(row.generated_at)}</span> },
    { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Actions',
      accessor: 'id',
      align: 'right',
      render: (row) => (
        <div className="flex justify-end gap-sm">
          <button
            onClick={() => navigate(`/invoices/${row.id}`)}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-high transition-colors text-on-surface-variant"
            title="View Invoice"
          >
            <span className="material-symbols-outlined text-[20px]">visibility</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <PageWrapper
      title="Invoices"
      description={`Review billing statements and track invoice clearances across ${invoices.length} entries.`}
    >
      <div className="mt-md">
        <DataTable columns={columns} data={invoices} isLoading={isLoading} />
      </div>
    </PageWrapper>
  );
};

export default InvoiceListPage;
