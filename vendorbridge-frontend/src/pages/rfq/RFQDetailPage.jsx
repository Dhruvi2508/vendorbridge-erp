import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRFQById } from '../../api/rfqApi';
import { getQuotationsByRFQ } from '../../api/quotationApi';
import { getVendors } from '../../api/vendorApi';
import { usePermissions } from '../../hooks/usePermissions';
import PageWrapper from '../../components/layout/PageWrapper';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate, formatCurrency } from '../../utils/formatters';

const RFQDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isVendor, isProcurementOfficer, isAdmin } = usePermissions();

  const { data: rfq, isLoading: isRfqLoading } = useQuery({
    queryKey: ['rfq', id],
    queryFn: () => getRFQById(id)
  });

  const { data: quotations = [], isLoading: isQuotesLoading } = useQuery({
    queryKey: ['rfqQuotations', id],
    queryFn: () => getQuotationsByRFQ(id)
  });

  const { data: vendors = [], isLoading: isVendorsLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: getVendors
  });

  const isLoading = isRfqLoading || isQuotesLoading || isVendorsLoading;

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!rfq) {
    return (
      <div className="text-center py-2xl">
        <p className="text-on-surface-variant text-body-md">RFQ not found.</p>
        <button onClick={() => navigate('/rfqs')} className="text-primary font-bold hover:underline mt-md">Back to RFQs</button>
      </div>
    );
  }

  const assignedVendorsDetails = vendors.filter(v => rfq.vendors?.includes(v.id));

  return (
    <PageWrapper
      title={rfq.title}
      description={`RFQ Number: ${rfq.rfq_number} | Deadline: ${formatDate(rfq.deadline)}`}
      actions={
        <div className="flex gap-md w-full sm:w-auto">
          <button
            onClick={() => navigate('/rfqs')}
            className="px-lg py-md border border-outline text-on-surface rounded-lg hover:bg-surface-container transition-colors flex items-center gap-xs"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back
          </button>
          {isVendor && rfq.status === 'OPEN' && (
            <button
              onClick={() => navigate(`/quotations/submit/${rfq.id}`)}
              className="bg-primary text-on-primary font-semibold px-lg py-md rounded-lg flex items-center gap-md shadow-[0_2px_0_0_rgba(116,91,0,0.5)] hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">add_task</span>
              Submit Quotation
            </button>
          )}
          {(isProcurementOfficer || isAdmin) && quotations.length > 0 && (
            <button
              onClick={() => navigate(`/quotations/compare/${rfq.id}`)}
              className="bg-primary-container text-on-primary-container font-semibold px-lg py-md rounded-lg flex items-center gap-md btn-primary-shadow hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">compare_arrows</span>
              Compare Bids ({quotations.length})
            </button>
          )}
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg mt-md">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-lg">
          <div className="bg-surface p-lg rounded-xl border border-outline-variant card-shadow space-y-md">
            <div className="flex justify-between items-center pb-sm border-b border-outline-variant">
              <h3 className="font-headline-sm text-headline-sm">RFQ Summary</h3>
              <StatusBadge status={rfq.status} />
            </div>
            <p className="text-body-md text-on-surface-variant leading-relaxed">{rfq.description}</p>
            {rfq.attachments?.length > 0 && (
              <div className="pt-md border-t border-outline-variant">
                <span className="font-semibold block mb-xs text-sm">Attachments</span>
                {rfq.attachments.map((file) => (
                  <a
                    key={file.id}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="inline-flex items-center gap-xs text-primary font-medium hover:underline text-xs bg-surface-container-low px-md py-sm rounded-lg border border-outline-variant"
                  >
                    <span className="material-symbols-outlined text-sm">description</span>
                    {file.file_name}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="bg-surface rounded-xl border border-outline-variant card-shadow overflow-hidden">
            <div className="bg-surface-container-low p-md border-b border-outline-variant">
              <h3 className="font-headline-sm text-headline-sm">Requested Line Items</h3>
            </div>
            <table className="w-full text-left border-collapse font-body-sm">
              <thead className="bg-surface-container border-b border-outline-variant">
                <tr>
                  <th className="px-lg py-md text-xs font-label-sm text-on-surface-variant uppercase tracking-wider">Item Name</th>
                  <th className="px-lg py-md text-xs font-label-sm text-on-surface-variant uppercase tracking-wider">Specification</th>
                  <th className="px-lg py-md text-xs font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {rfq.items?.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-lg py-md font-semibold text-on-surface">{item.item_name}</td>
                    <td className="px-lg py-md text-on-surface-variant">{item.description}</td>
                    <td className="px-lg py-md text-right font-label-md">
                      {item.quantity} <span className="text-on-surface-variant text-xs">{item.unit}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-lg">
          <div className="bg-surface p-lg rounded-xl border border-outline-variant card-shadow space-y-lg">
            <h3 className="font-headline-sm text-headline-sm pb-sm border-b border-outline-variant">Assigned Suppliers</h3>
            <div className="space-y-md max-h-60 overflow-y-auto custom-scrollbar">
              {assignedVendorsDetails.map((vendor) => (
                <div key={vendor.id} className="flex justify-between items-start p-md bg-surface-container-low border border-outline-variant rounded-lg">
                  <div>
                    <h4 className="font-semibold text-on-surface text-sm">{vendor.company_name}</h4>
                    <span className="text-xs text-on-surface-variant font-label-sm">{vendor.category}</span>
                  </div>
                  <span className="text-primary font-bold font-label-sm text-xs">Rating: {vendor.rating}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface p-lg rounded-xl border border-outline-variant card-shadow space-y-lg">
            <h3 className="font-headline-sm text-headline-sm pb-sm border-b border-outline-variant">Quotations Received</h3>
            {quotations.length === 0 ? (
              <p className="text-on-surface-variant text-xs italic text-center py-md">No quotations submitted yet.</p>
            ) : (
              <div className="space-y-md">
                {quotations.map((quote) => {
                  const vendorName = vendors.find(v => v.id === quote.vendor_id)?.company_name || 'Vendor';
                  return (
                    <div key={quote.id} className="p-md bg-surface-container-low border border-outline-variant rounded-lg flex justify-between items-center font-body-sm text-xs">
                      <div>
                        <h4 className="font-semibold text-on-surface text-sm">{vendorName}</h4>
                        <span className="text-xs text-on-surface-variant font-label-md">{quote.quotation_number}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-on-surface block font-label-sm">{formatCurrency(quote.total_amount)}</span>
                        <span className="text-xs text-on-surface-variant">{quote.delivery_days} days delivery</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default RFQDetailPage;
