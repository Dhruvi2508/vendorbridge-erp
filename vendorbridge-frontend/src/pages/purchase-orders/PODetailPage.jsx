import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getPurchaseOrderById, updatePurchaseOrder } from '../../api/purchaseOrderApi';
import { createInvoice } from '../../api/invoiceApi';
import { usePermissions } from '../../hooks/usePermissions';
import PageWrapper from '../../components/layout/PageWrapper';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

const PODetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isProcurementOfficer, isAdmin } = usePermissions();

  const { data: po, isLoading } = useQuery({
    queryKey: ['purchaseOrder', id],
    queryFn: () => getPurchaseOrderById(id)
  });

  const invoiceMutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: (data) => {
      toast.success('Invoice generated successfully from PO!');
      navigate(`/invoices/${data.id}`);
    },
    onError: (err) => toast.error(err.message || 'Invoice generation failed.')
  });

  const statusMutation = useMutation({
    mutationFn: (newStatus) => updatePurchaseOrder(id, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrder', id] });
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      toast.success('PO status updated successfully!');
    },
    onError: (err) => toast.error(err.message || 'Status update failed.')
  });

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!po) {
    return (
      <div className="text-center py-2xl">
        <p className="text-on-surface-variant text-body-md">Purchase Order not found.</p>
        <button onClick={() => navigate('/purchase-orders')} className="text-primary font-bold hover:underline mt-md">Back to POs</button>
      </div>
    );
  }

  const handleGenerateInvoice = () => {
    invoiceMutation.mutate({
      purchase_order_id: po.id,
      po_number: po.po_number,
      vendor_id: po.vendor_id,
      vendor_name: po.vendor_name,
      subtotal: po.total_amount,
      items: po.items
    });
  };

  return (
    <PageWrapper
      title={`Purchase Order: ${po.po_number}`}
      description={`Vendor Ref: ${po.vendor_name} | Value: ${formatCurrency(po.total_amount)}`}
      actions={
        <div className="flex gap-md w-full sm:w-auto">
          <button
            onClick={() => navigate('/purchase-orders')}
            className="px-lg py-md border border-outline text-on-surface rounded-lg hover:bg-surface-container transition-colors flex items-center gap-xs"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back
          </button>
          {po.status === 'ISSUED' && (isProcurementOfficer || isAdmin) && (
            <button
              onClick={() => statusMutation.mutate('COMPLETED')}
              className="bg-primary text-on-primary font-semibold px-lg py-md rounded-lg flex items-center gap-md shadow-[0_2px_0_0_rgba(116,91,0,0.5)] hover:opacity-90 active:scale-95 transition-all text-sm"
            >
              <span className="material-symbols-outlined">done_all</span>
              Mark Completed
            </button>
          )}
          {po.status === 'ISSUED' && (isProcurementOfficer || isAdmin) && (
            <button
              onClick={handleGenerateInvoice}
              disabled={invoiceMutation.isPending}
              className="bg-primary-container text-on-primary-container font-semibold px-lg py-md rounded-lg flex items-center gap-md btn-primary-shadow hover:opacity-90 active:scale-95 transition-all text-sm"
            >
              <span className="material-symbols-outlined">receipt</span>
              Generate Invoice
            </button>
          )}
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg mt-md">
        {/* Left detail panel */}
        <div className="lg:col-span-2 space-y-lg">
          {/* Vendor Details */}
          <div className="bg-surface p-lg rounded-xl border border-outline-variant card-shadow space-y-md">
            <h3 className="font-headline-sm text-headline-sm pb-sm border-b border-outline-variant">Supplier Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md font-body-sm text-sm">
              <div>
                <span className="text-on-surface-variant font-semibold block text-xs">Supplier Name</span>
                <p className="font-semibold text-on-surface mt-xs">{po.vendor_name}</p>
              </div>
              <div>
                <span className="text-on-surface-variant font-semibold block text-xs">Order Issued Date</span>
                <p className="font-medium text-on-surface mt-xs">{formatDate(po.created_at)}</p>
              </div>
            </div>
          </div>

          {/* PO Items Table */}
          <div className="bg-surface rounded-xl border border-outline-variant card-shadow overflow-hidden">
            <div className="bg-surface-container-low p-md border-b border-outline-variant">
              <h3 className="font-headline-sm text-headline-sm">Itemized Order Specifications</h3>
            </div>
            <table className="w-full text-left border-collapse font-body-sm">
              <thead className="bg-surface-container border-b border-outline-variant">
                <tr>
                  <th className="px-lg py-md text-xs font-label-sm text-on-surface-variant uppercase tracking-wider">Item Name</th>
                  <th className="px-lg py-md text-xs font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Quantity</th>
                  <th className="px-lg py-md text-xs font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Unit Price</th>
                  <th className="px-lg py-md text-xs font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {po.items?.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-lg py-md font-semibold text-on-surface">{item.item_name}</td>
                    <td className="px-lg py-md text-right font-label-md">{item.quantity}</td>
                    <td className="px-lg py-md text-right font-label-md">{formatCurrency(item.unit_price)}</td>
                    <td className="px-lg py-md text-right font-label-md font-bold">{formatCurrency(item.total_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-surface-container-low px-lg py-md border-t border-outline-variant flex justify-between items-center font-semibold">
              <span>Grand Total</span>
              <span className="text-primary font-label-sm font-bold text-lg">{formatCurrency(po.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Right timeline details */}
        <div className="bg-surface p-lg rounded-xl border border-outline-variant card-shadow space-y-lg">
          <h3 className="font-headline-sm text-headline-sm pb-sm border-b border-outline-variant">PO Status Tracker</h3>
          
          <div className="space-y-lg relative pl-8 font-body-sm text-xs before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant">
            {/* Step 1 */}
            <div className="relative">
              <span className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">1</span>
              <div>
                <p className="font-bold text-on-surface">PO Draft Created</p>
                <p className="text-on-surface-variant font-medium">Auto-generated upon winning quotation selection.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <span className={`absolute -left-8 top-0 w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                po.status === 'ISSUED' || po.status === 'COMPLETED' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant border border-outline-variant'
              }`}>2</span>
              <div>
                <p className="font-bold text-on-surface">Order Issued</p>
                <p className="text-on-surface-variant font-medium">Signed and dispatched to supplier for manufacturing.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <span className={`absolute -left-8 top-0 w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                po.status === 'COMPLETED' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant border border-outline-variant'
              }`}>3</span>
              <div>
                <p className="font-bold text-on-surface">Completion Audit</p>
                <p className="text-on-surface-variant font-medium">Supplies received, inspected, and invoice generation initialized.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PODetailPage;
