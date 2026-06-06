import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getVendorById } from '../../api/vendorApi';
import { formatDate } from '../../utils/formatters';
import PageWrapper from '../../components/layout/PageWrapper';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';

const VendorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: vendor, isLoading } = useQuery({
    queryKey: ['vendor', id],
    queryFn: () => getVendorById(id)
  });

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!vendor) {
    return (
      <div className="text-center py-2xl">
        <p className="text-on-surface-variant text-body-md">Vendor not found.</p>
        <button onClick={() => navigate('/vendors')} className="text-primary font-bold hover:underline mt-md">Back to Directory</button>
      </div>
    );
  }

  return (
    <PageWrapper
      title={vendor.company_name}
      description={`Vendor Code: ${vendor.vendor_code} | Established compliance audits.`}
      actions={
        <button
          onClick={() => navigate('/vendors')}
          className="px-lg py-md border border-outline text-on-surface rounded-lg hover:bg-surface-container transition-colors flex items-center gap-xs"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Directory
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg mt-md">
        {/* Profile Details Card */}
        <div className="bg-surface p-lg rounded-xl border border-outline-variant card-shadow space-y-lg">
          <div className="pb-md border-b border-outline-variant flex justify-between items-center">
            <h3 className="font-headline-sm text-headline-sm">Profile Details</h3>
            <StatusBadge status={vendor.status} />
          </div>
          <div className="space-y-md font-body-sm text-sm">
            <div>
              <span className="text-on-surface-variant font-semibold">Contact Person</span>
              <p className="text-on-surface mt-xs font-medium">{vendor.contact_person}</p>
            </div>
            <div>
              <span className="text-on-surface-variant font-semibold">GST Registration</span>
              <p className="text-on-surface mt-xs font-label-md">{vendor.gst_number}</p>
            </div>
            <div>
              <span className="text-on-surface-variant font-semibold">Email Address</span>
              <p className="text-on-surface mt-xs font-medium text-primary hover:underline cursor-pointer">{vendor.email}</p>
            </div>
            <div>
              <span className="text-on-surface-variant font-semibold">Phone Number</span>
              <p className="text-on-surface mt-xs font-medium">{vendor.phone}</p>
            </div>
            <div>
              <span className="text-on-surface-variant font-semibold">Address</span>
              <p className="text-on-surface mt-xs font-medium">{vendor.address}</p>
            </div>
          </div>
        </div>

        {/* Performance & Metrics */}
        <div className="lg:col-span-2 bg-surface p-lg rounded-xl border border-outline-variant card-shadow space-y-lg">
          <div className="pb-md border-b border-outline-variant">
            <h3 className="font-headline-sm text-headline-sm">Supplier Performance Ratings</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-lg text-center">
            <div className="p-md bg-surface-container-low rounded-xl border border-outline-variant">
              <span className="text-on-surface-variant text-xs uppercase font-label-sm block">Quality Score</span>
              <span className="font-headline-lg text-headline-lg text-primary block mt-xs">{vendor.rating} / 5.0</span>
              <span className="text-label-sm text-xs text-on-surface-variant">Top Tier Supplier</span>
            </div>
            <div className="p-md bg-surface-container-low rounded-xl border border-outline-variant">
              <span className="text-on-surface-variant text-xs uppercase font-label-sm block">On-Time Delivery</span>
              <span className="font-headline-lg text-headline-lg text-secondary block mt-xs">96%</span>
              <span className="text-label-sm text-xs text-green-600 flex items-center justify-center gap-xs mt-xs">
                <span className="material-symbols-outlined text-xs">trending_up</span> +3% vs LY
              </span>
            </div>
            <div className="p-md bg-surface-container-low rounded-xl border border-outline-variant">
              <span className="text-on-surface-variant text-xs uppercase font-label-sm block">Bids Won</span>
              <span className="font-headline-lg text-headline-lg text-on-surface block mt-xs">14 / 18</span>
              <span className="text-label-sm text-xs text-on-surface-variant">78% success rate</span>
            </div>
          </div>

          <div className="pt-md border-t border-outline-variant">
            <h4 className="font-semibold mb-md">Operational Timeline</h4>
            <div className="space-y-md">
              <div className="flex gap-md font-body-sm text-xs">
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">1</div>
                <div>
                  <p className="font-bold text-on-surface">Compliance Verified</p>
                  <p className="text-on-surface-variant">GST documentation verified. Audited on {formatDate(vendor.created_at)}</p>
                </div>
              </div>
              <div className="flex gap-md font-body-sm text-xs">
                <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">2</div>
                <div>
                  <p className="font-bold text-on-surface">Bidding Authorized</p>
                  <p className="text-on-surface-variant">Supplier authorized for raw material tenders.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default VendorDetailPage;
