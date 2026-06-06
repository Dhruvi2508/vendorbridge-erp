import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getQuotations } from '../../api/quotationApi';
import { getRFQs } from '../../api/rfqApi';
import { getVendors } from '../../api/vendorApi';
import { usePermissions } from '../../hooks/usePermissions';
import PageWrapper from '../../components/layout/PageWrapper';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

const QuotationListPage = () => {
  const navigate = useNavigate();
  const { isVendor } = usePermissions();

  const { data: quotations = [], isLoading: isQuotesLoading } = useQuery({
    queryKey: ['quotations'],
    queryFn: getQuotations
  });

  const { data: rfqs = [], isLoading: isRfqsLoading } = useQuery({
    queryKey: ['rfqs'],
    queryFn: getRFQs
  });

  const { data: vendors = [], isLoading: isVendorsLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: getVendors
  });

  const isLoading = isQuotesLoading || isRfqsLoading || isVendorsLoading;

  // Filter if VENDOR
  const visibleQuotations = isVendor
    ? quotations.filter((q) => q.vendor_id === 3) // Mock vendor profile ID is 3
    : quotations;

  const columns = [
    { header: 'Quotation Number', accessor: 'quotation_number', render: (row) => <span className="font-label-md">{row.quotation_number}</span> },
    {
      header: 'RFQ Ref',
      accessor: 'rfq_id',
      render: (row) => {
        const rfq = rfqs.find((r) => r.id === row.rfq_id);
        return rfq ? <span>{rfq.title} ({rfq.rfq_number})</span> : <span>RFQ #{row.rfq_id}</span>;
      }
    },
    ...(!isVendor ? [{
      header: 'Supplier',
      accessor: 'vendor_id',
      render: (row) => {
        const v = vendors.find((vend) => vend.id === row.vendor_id);
        return <span>{v ? v.company_name : `Vendor #${row.vendor_id}`}</span>;
      }
    }] : []),
    { header: 'Total Bid', accessor: 'total_amount', render: (row) => <span className="font-label-sm font-semibold">{formatCurrency(row.total_amount)}</span> },
    { header: 'Delivery (Days)', accessor: 'delivery_days', align: 'right', render: (row) => <span className="font-label-md">{row.delivery_days}</span> },
    { header: 'Submitted At', accessor: 'submitted_at', render: (row) => <span className="font-label-sm text-xs">{formatDate(row.submitted_at)}</span> },
    { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> }
  ];

  return (
    <PageWrapper
      title="Quotations"
      description={isVendor ? "Review and update your submitted pricing sheets." : "Manage quotations received from active suppliers."}
    >
      <div className="mt-md">
        <DataTable columns={columns} data={visibleQuotations} isLoading={isLoading} />
      </div>
    </PageWrapper>
  );
};

export default QuotationListPage;
