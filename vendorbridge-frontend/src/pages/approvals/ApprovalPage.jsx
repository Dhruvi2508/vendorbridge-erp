import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getPendingApprovals, getApprovalHistory, approveQuotation, rejectQuotation } from '../../api/approvalApi';
import { usePermissions } from '../../hooks/usePermissions';
import PageWrapper from '../../components/layout/PageWrapper';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const ApprovalPage = () => {
  const queryClient = useQueryClient();
  const { isManager, isAdmin } = usePermissions();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromQuery = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromQuery === 'history' ? 'history' : 'pending');
  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    if (tabFromQuery === 'pending' || tabFromQuery === 'history') {
      setActiveTab(tabFromQuery);
    }
  }, [tabFromQuery]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', tab);
    setSearchParams(nextParams, { replace: true });
  };

  const { data: pending = [], isLoading: isPendingLoading } = useQuery({
    queryKey: ['pendingApprovals'],
    queryFn: getPendingApprovals
  });

  const { data: history = [], isLoading: isHistoryLoading } = useQuery({
    queryKey: ['approvalHistory'],
    queryFn: getApprovalHistory
  });

  const approveMutation = useMutation({
    mutationFn: approveQuotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['approvalHistory'] });
      toast.success('Quotation approved successfully! Purchase Order generated.');
    },
    onError: (err) => toast.error(err.message || 'Approval failed.')
  });

  const rejectMutation = useMutation({
    mutationFn: rejectQuotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['approvalHistory'] });
      toast.success('Quotation rejected.');
    },
    onError: (err) => toast.error(err.message || 'Rejection failed.')
  });

  const handleApprove = (approvalId) => {
    approveMutation.mutate({ approvalId, remarks: remarks[approvalId] || '' });
  };

  const handleReject = (approvalId) => {
    rejectMutation.mutate({ approvalId, remarks: remarks[approvalId] || '' });
  };

  const handleRemarksChange = (approvalId, val) => {
    setRemarks(prev => ({ ...prev, [approvalId]: val }));
  };

  const isLoading = isPendingLoading || isHistoryLoading;

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <PageWrapper
      title="Workflow Approvals Center"
      description="Review and authorize pending procurement requests."
    >
      {/* Tabs */}
      <div className="flex border-b border-outline-variant mt-md">
        <button
          onClick={() => handleTabChange('pending')}
          className={`px-lg py-md font-semibold text-body-md border-b-2 transition-colors ${
            activeTab === 'pending'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Pending Approvals ({pending.length})
        </button>
        <button
          onClick={() => handleTabChange('history')}
          className={`px-lg py-md font-semibold text-body-md border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Approval History ({history.length})
        </button>
      </div>

      {/* Content */}
      <div className="mt-lg">
        {activeTab === 'pending' ? (
          pending.length === 0 ? (
            <div className="text-center py-2xl bg-surface border border-outline-variant rounded-xl">
              <span className="material-symbols-outlined text-[48px] text-outline mb-md">task_alt</span>
              <p className="text-on-surface-variant font-medium">All pending authorizations completed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              {pending.map((item) => (
                <div key={item.id} className="bg-surface border border-outline-variant rounded-xl card-shadow p-lg space-y-md flex flex-col justify-between">
                  <div className="space-y-sm">
                    <div className="flex justify-between items-start">
                      <span className="font-label-sm text-on-surface-variant text-xs">{item.rfq_number}</span>
                      <span className="text-xs text-on-surface-variant font-label-md">Requested {formatDateTime(item.requested_at)}</span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">{item.rfq_title}</h4>
                    <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant space-y-xs">
                      <p className="text-xs text-on-surface-variant uppercase font-label-sm">Winner Quotation Details</p>
                      <div className="flex justify-between items-center mt-xs">
                        <span className="font-bold text-on-surface">{item.vendor_name}</span>
                        <span className="font-bold text-primary text-lg font-label-sm">{formatCurrency(item.amount)}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant">Lead time: {item.delivery_days} calendar days | Ref: {item.quotation_number}</p>
                    </div>
                  </div>

                  {/* Remarks & Buttons */}
                  <div className="pt-md border-t border-outline-variant space-y-md">
                    <div>
                      <label className="font-label-sm text-on-surface-variant uppercase text-xs block mb-xs">Approver Remarks</label>
                      <textarea
                        value={remarks[item.id] || ''}
                        onChange={(e) => handleRemarksChange(item.id, e.target.value)}
                        placeholder="Add authorization remarks..."
                        rows={2}
                        className="w-full border border-outline rounded-lg p-md text-body-md focus:border-primary outline-none bg-surface"
                      />
                    </div>
                    <div className="flex gap-md justify-end">
                      <button
                        onClick={() => handleReject(item.id)}
                        className="px-lg py-md border border-error text-error rounded-lg hover:bg-error-container transition-colors text-sm font-semibold"
                      >
                        Reject Request
                      </button>
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="px-lg py-md bg-primary text-on-primary rounded-lg shadow-[0_2px_0_0_rgba(116,91,0,0.5)] hover:opacity-90 active:scale-95 transition-all text-sm font-semibold"
                      >
                        Approve & Issue PO
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="bg-surface rounded-xl border border-outline-variant card-shadow overflow-hidden">
            <table className="w-full text-left border-collapse font-body-sm">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-lg py-md text-xs font-label-sm text-on-surface-variant uppercase tracking-wider">RFQ Ref</th>
                  <th className="px-lg py-md text-xs font-label-sm text-on-surface-variant uppercase tracking-wider">Vendor</th>
                  <th className="px-lg py-md text-xs font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Amount</th>
                  <th className="px-lg py-md text-xs font-label-sm text-on-surface-variant uppercase tracking-wider">Approved Date</th>
                  <th className="px-lg py-md text-xs font-label-sm text-on-surface-variant uppercase tracking-wider">Remarks</th>
                  <th className="px-lg py-md text-xs font-label-sm text-on-surface-variant uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-lg py-md">
                      <div>
                        <p className="font-semibold">{item.rfq_title}</p>
                        <p className="text-xs text-on-surface-variant font-label-sm">{item.rfq_number}</p>
                      </div>
                    </td>
                    <td className="px-lg py-md font-semibold">{item.vendor_name}</td>
                    <td className="px-lg py-md text-right font-label-sm">{formatCurrency(item.amount)}</td>
                    <td className="px-lg py-md font-label-sm text-xs">{formatDateTime(item.approved_at)}</td>
                    <td className="px-lg py-md text-on-surface-variant text-xs">{item.remarks}</td>
                    <td className="px-lg py-md">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default ApprovalPage;
