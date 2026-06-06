import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getQuotationCompare, updateQuotation } from '../../api/quotationApi';
import { getRFQById } from '../../api/rfqApi';
import { usePermissions } from '../../hooks/usePermissions';
import PageWrapper from '../../components/layout/PageWrapper';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency } from '../../utils/formatters';

const QuotationComparePage = () => {
  const { rfqId } = useParams();
  const navigate = useNavigate();
  const { canCompareQuotations } = usePermissions();

  const [sortBy, setSortBy] = useState('price'); // 'price' | 'delivery'

  const { data: rfq, isLoading: isRfqLoading } = useQuery({
    queryKey: ['rfqDetail', rfqId],
    queryFn: () => getRFQById(rfqId)
  });

  const { data: bids = [], isLoading: isBidsLoading } = useQuery({
    queryKey: ['quotationCompare', rfqId],
    queryFn: () => getQuotationCompare(rfqId)
  });

  const selectWinnerMutation = useMutation({
    mutationFn: async (quotationId) => {
      // Update quotation to PENDING_APPROVAL status
      await updateQuotation(quotationId, { status: 'PENDING_APPROVAL' });
      return quotationId;
    },
    onSuccess: () => {
      toast.success('Winner selected! Pending approval request created.');
      navigate('/approvals');
    },
    onError: (err) => {
      toast.error(err.message || 'Winner selection failed.');
    }
  });

  const isLoading = isRfqLoading || isBidsLoading;

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (bids.length === 0) {
    return (
      <PageWrapper title="Quotation Comparison" description="Compare incoming proposals.">
        <div className="text-center py-2xl bg-surface border border-outline-variant rounded-xl mt-md">
          <span className="material-symbols-outlined text-[48px] text-outline mb-md">inventory_2</span>
          <p className="text-on-surface-variant font-medium">No quotations received yet for this RFQ.</p>
          <button onClick={() => navigate('/rfqs')} className="text-primary font-bold hover:underline mt-sm">Back to RFQs</button>
        </div>
      </PageWrapper>
    );
  }

  // Find lowest price
  const lowestPrice = Math.min(...bids.map((b) => b.total_amount));

  // Sort bids
  const sortedBids = [...bids].sort((a, b) => {
    if (sortBy === 'price') return a.total_amount - b.total_amount;
    if (sortBy === 'delivery') return a.delivery_days - b.delivery_days;
    return 0;
  });

  return (
    <PageWrapper
      title="Bid Comparison Tool"
      description={`Comparing ${bids.length} proposals for RFQ: ${rfq?.title}`}
      actions={
        <button
          onClick={() => navigate(`/rfqs/${rfqId}`)}
          className="px-lg py-md border border-outline text-on-surface rounded-lg hover:bg-surface-container transition-colors flex items-center gap-xs"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Details
        </button>
      }
    >
      {/* Sorting bar */}
      <div className="bg-surface p-lg rounded-xl card-shadow border border-outline-variant flex justify-between items-center flex-wrap gap-md mt-md">
        <div className="flex items-center gap-md">
          <span className="font-label-sm uppercase text-on-surface-variant">Sort Candidates</span>
          <div className="flex gap-xs">
            <button
              onClick={() => setSortBy('price')}
              className={`px-md py-sm border border-outline-variant rounded-lg text-body-sm font-semibold transition-colors ${
                sortBy === 'price' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container hover:bg-surface-container-high'
              }`}
            >
              Lowest Cost
            </button>
            <button
              onClick={() => setSortBy('delivery')}
              className={`px-md py-sm border border-outline-variant rounded-lg text-body-sm font-semibold transition-colors ${
                sortBy === 'delivery' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container hover:bg-surface-container-high'
              }`}
            >
              Fastest Lead Time
            </button>
          </div>
        </div>
        <span className="font-label-sm text-on-surface-variant uppercase text-xs">RFQ Ref: {rfq?.rfq_number}</span>
      </div>

      {/* Comparison Grid */}
      <div className="bg-surface rounded-xl card-shadow border border-outline-variant overflow-hidden mt-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Vendor</th>
                <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Rating</th>
                <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Delivery Details</th>
                <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Total Bid Amount</th>
                <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Status</th>
                {canCompareQuotations && <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider text-center">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {sortedBids.map((bid) => {
                const isWinnerCandidate = bid.total_amount === lowestPrice;
                return (
                  <tr
                    key={bid.id}
                    className={`transition-colors ${isWinnerCandidate ? 'bg-green-50/40 hover:bg-green-50/60' : 'table-row-hover'}`}
                  >
                    <td className="px-lg py-md">
                      <div>
                        <p className="font-semibold text-on-surface">{bid.vendor_name}</p>
                        <p className="text-xs text-on-surface-variant font-label-md">{bid.quotation_number}</p>
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-xs text-amber-500">
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="font-bold font-label-sm">{bid.rating}</span>
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      <p className="font-semibold">{bid.delivery_days} calendar days</p>
                      <p className="text-xs text-on-surface-variant font-body-sm">{bid.notes}</p>
                    </td>
                    <td className="px-lg py-md text-right font-label-sm">
                      <span className={`font-bold text-lg ${isWinnerCandidate ? 'text-green-700' : 'text-on-surface'}`}>
                        {formatCurrency(bid.total_amount)}
                      </span>
                      {isWinnerCandidate && <span className="block text-[10px] text-green-700 font-bold uppercase tracking-wider">Best Price</span>}
                    </td>
                    <td className="px-lg py-md">
                      <StatusBadge status={bid.status} />
                    </td>
                    {canCompareQuotations && (
                      <td className="px-lg py-md text-center">
                        {bid.status === 'SUBMITTED' ? (
                          <button
                            onClick={() => selectWinnerMutation.mutate(bid.id)}
                            className="bg-primary text-on-primary font-semibold px-md py-sm rounded hover:opacity-90 active:scale-95 transition-all text-xs shadow-sm"
                          >
                            Select Winner
                          </button>
                        ) : (
                          <span className="text-xs text-on-surface-variant italic">Bid Selected</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  );
};

export default QuotationComparePage;
