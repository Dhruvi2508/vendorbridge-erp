import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getRFQs, deleteRFQ } from '../../api/rfqApi';
import { usePermissions } from '../../hooks/usePermissions';
import PageWrapper from '../../components/layout/PageWrapper';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatDate } from '../../utils/formatters';

const RFQListPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { canCreateRFQ } = usePermissions();
  const [deletingRfqId, setDeletingRfqId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: rfqs = [], isLoading } = useQuery({
    queryKey: ['rfqs'],
    queryFn: getRFQs
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRFQ,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfqs'] });
      toast.success('RFQ deleted successfully!');
    },
    onError: (err) => toast.error(err.message || 'Failed to delete RFQ')
  });

  const handleOpenDelete = (id) => {
    setDeletingRfqId(id);
    setIsDeleteOpen(true);
  };

  const columns = [
    { header: 'RFQ Number', accessor: 'rfq_number', render: (row) => <span className="font-label-md">{row.rfq_number}</span> },
    { header: 'Title', accessor: 'title', render: (row) => <span className="font-semibold">{row.title}</span> },
    { header: 'Deadline', accessor: 'deadline', render: (row) => <span className="font-label-sm">{formatDate(row.deadline)}</span> },
    { header: 'Created By', accessor: 'created_by' },
    { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Actions',
      accessor: 'id',
      align: 'right',
      render: (row) => (
        <div className="flex justify-end gap-sm">
          <button
            onClick={() => navigate(`/rfqs/${row.id}`)}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-high transition-colors text-on-surface-variant"
            title="View Details"
          >
            <span className="material-symbols-outlined text-[20px]">visibility</span>
          </button>
          {canCreateRFQ && (
            <button
              onClick={() => handleOpenDelete(row.id)}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-error-container hover:text-on-error-container transition-colors text-on-surface-variant"
              title="Delete RFQ"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <PageWrapper
      title="Request for Quotations"
      description={`Monitor active tenders and review incoming pricing sheets across ${rfqs.length} requests.`}
      actions={
        canCreateRFQ && (
          <button
            onClick={() => navigate('/rfqs/create')}
            className="bg-primary-container text-on-primary-container font-semibold px-lg py-md rounded-lg flex items-center gap-md btn-primary-shadow hover:opacity-90 active:scale-95 transition-all w-full sm:w-auto justify-center"
          >
            <span className="material-symbols-outlined">add</span>
            New RFQ
          </button>
        )
      }
    >
      <div className="mt-md">
        <DataTable columns={columns} data={rfqs} isLoading={isLoading} />
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutate(deletingRfqId)}
        title="Delete RFQ"
        message="Are you sure you want to delete this RFQ? All assigned supplier links and received quotations will be permanently removed."
        confirmText="Delete RFQ"
        isDanger
      />
    </PageWrapper>
  );
};

export default RFQListPage;
