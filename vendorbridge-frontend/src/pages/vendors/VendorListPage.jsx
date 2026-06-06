import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import toast from 'react-hot-toast';
import { getVendors, searchVendors, createVendor, updateVendor, deleteVendor, getCategories } from '../../api/vendorApi';
import { usePermissions } from '../../hooks/usePermissions';
import PageWrapper from '../../components/layout/PageWrapper';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import FormTextarea from '../../components/forms/FormTextarea';

const vendorFormSchema = zod.object({
  company_name: zod.string().min(1, 'Company name is required'),
  gst_number: zod.string().min(15, 'GST number must be 15 characters').max(15, 'GST number must be 15 characters'),
  contact_person: zod.string().min(1, 'Contact person is required'),
  email: zod.string().email('Invalid email address'),
  phone: zod.string().min(10, 'Phone must be at least 10 digits'),
  address: zod.string().min(1, 'Address is required'),
  category_id: zod.string().min(1, 'Category is required')
});

const VendorListPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { canManageVendors } = usePermissions();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal & Dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [deletingVendorId, setDeletingVendorId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Queries
  const { data: vendors = [], isLoading: isVendorsLoading } = useQuery({
    queryKey: ['vendors', searchTerm],
    queryFn: () => (searchTerm ? searchVendors(searchTerm) : getVendors())
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor added successfully!');
      setIsFormOpen(false);
    },
    onError: (err) => toast.error(err.message || 'Failed to add vendor')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateVendor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor updated successfully!');
      setIsFormOpen(false);
    },
    onError: (err) => toast.error(err.message || 'Failed to update vendor')
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor deleted successfully!');
    },
    onError: (err) => toast.error(err.message || 'Failed to delete vendor')
  });

  // Form setup
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: { company_name: '', gst_number: '', contact_person: '', email: '', phone: '', address: '', category_id: '' }
  });

  const handleOpenAdd = () => {
    setEditingVendor(null);
    reset({ company_name: '', gst_number: '', contact_person: '', email: '', phone: '', address: '', category_id: '' });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (vendor) => {
    setEditingVendor(vendor);
    reset({
      company_name: vendor.company_name,
      gst_number: vendor.gst_number,
      contact_person: vendor.contact_person,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      category_id: String(vendor.category_id || '')
    });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (id) => {
    setDeletingVendorId(id);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editingVendor) {
      updateMutation.mutate({ id: editingVendor.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Filter vendors
  const filteredVendors = vendors.filter((v) => {
    const matchesCategory = categoryFilter === 'All Categories' || v.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    return matchesCategory && matchesStatus;
  });

  const columns = [
    {
      header: 'Company Name',
      accessor: 'company_name',
      render: (row) => (
        <div className="flex items-center gap-md">
          <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center border border-outline-variant">
            <span className="material-symbols-outlined text-on-surface-variant">
              {row.category === 'Logistics' ? 'local_shipping' : row.category === 'Electronics' ? 'memory' : 'precision_manufacturing'}
            </span>
          </div>
          <div>
            <p className="font-semibold text-on-surface">{row.company_name}</p>
            <p className="font-label-sm text-on-surface-variant text-xs">{row.address}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => (
        <span className="px-sm py-1 bg-surface-container-highest text-on-surface text-[12px] font-medium rounded border border-outline-variant">
          {row.category}
        </span>
      )
    },
    { header: 'GST Number', accessor: 'gst_number', render: (row) => <span className="font-label-md">{row.gst_number}</span> },
    {
      header: 'Performance',
      accessor: 'rating',
      render: (row) => (
        <div className="flex items-center gap-sm">
          <div className="flex-1 h-1.5 w-16 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${(row.rating || 5) * 20}%` }}></div>
          </div>
          <span className="font-label-sm font-bold text-primary">{row.rating}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      accessor: 'id',
      align: 'right',
      render: (row) => (
        <div className="flex justify-end gap-sm">
          <button
            onClick={() => navigate(`/vendors/${row.id}`)}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-high transition-colors text-on-surface-variant"
            title="View Details"
          >
            <span className="material-symbols-outlined text-[20px]">visibility</span>
          </button>
          {canManageVendors && (
            <>
              <button
                onClick={() => handleOpenEdit(row)}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-high transition-colors text-on-surface-variant"
                title="Edit Vendor"
              >
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
              <button
                onClick={() => handleOpenDelete(row.id)}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-error-container hover:text-on-error-container transition-colors text-on-surface-variant"
                title="Delete Vendor"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <PageWrapper
      title="Vendors"
      description={`Manage your supplier directory and monitor compliance across ${vendors.length} registered partners.`}
      actions={
        canManageVendors && (
          <button
            onClick={handleOpenAdd}
            className="bg-primary-container text-on-primary-container font-semibold px-lg py-md rounded-lg flex items-center gap-md btn-primary-shadow hover:opacity-90 active:scale-95 transition-all w-full sm:w-auto justify-center"
          >
            <span className="material-symbols-outlined">add</span>
            Add New Vendor
          </button>
        )
      }
    >
      {/* Filters */}
      <div className="bg-surface p-lg rounded-xl card-shadow mb-lg border border-outline-variant flex flex-wrap gap-lg items-center">
        <div className="flex-1 min-w-[240px]">
          <label className="font-label-sm uppercase text-on-surface-variant block mb-xs">Search Company</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">business</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-outline rounded-lg pl-11 pr-md py-sm focus:border-primary focus:ring-1 focus:ring-primary-container outline-none transition-all"
              placeholder="Search by name or GST..."
            />
          </div>
        </div>
        <div className="w-full sm:w-64">
          <label className="font-label-sm uppercase text-on-surface-variant block mb-xs">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full border border-outline rounded-lg px-md py-sm focus:border-primary focus:ring-1 focus:ring-primary-container outline-none transition-all bg-surface"
          >
            <option>All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.category_name}>
                {c.category_name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-64">
          <label className="font-label-sm uppercase text-on-surface-variant block mb-xs">Status</label>
          <div className="flex gap-xs">
            {['All', 'Verified', 'Pending'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-md py-sm border border-outline-variant rounded-lg text-body-sm font-medium transition-colors flex-1 ${
                  statusFilter === st ? 'bg-secondary-container text-on-secondary-container font-semibold' : 'bg-surface-container hover:bg-surface-container-high'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredVendors}
        isLoading={isVendorsLoading}
        pagination={{
          currentPage: 1,
          totalPages: 1,
          onPageChange: () => {},
          totalItems: filteredVendors.length,
          itemsPerPage: 10
        }}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingVendor ? 'Edit Vendor Profile' : 'Add New Vendor'}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-lg py-md">
          <FormInput
            label="Company Name"
            icon="business"
            placeholder="Global Enterprises Ltd."
            error={errors.company_name}
            {...register('company_name')}
          />
          <FormInput
            label="GST Number"
            icon="receipt"
            placeholder="03AAACG4125G1Z9"
            error={errors.gst_number}
            {...register('gst_number')}
          />
          <FormInput
            label="Contact Person"
            icon="person"
            placeholder="Rajesh Kumar"
            error={errors.contact_person}
            {...register('contact_person')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <FormInput
              label="Email Address"
              type="email"
              icon="mail"
              placeholder="rajesh@company.com"
              error={errors.email}
              {...register('email')}
            />
            <FormInput
              label="Phone Number"
              icon="call"
              placeholder="+91 98765-43210"
              error={errors.phone}
              {...register('phone')}
            />
          </div>
          <FormSelect
            label="Category"
            icon="category"
            options={[
              { value: '', label: 'Select Category' },
              ...categories.map((c) => ({ value: String(c.id), label: c.category_name }))
            ]}
            error={errors.category_id}
            {...register('category_id')}
          />
          <FormTextarea
            label="Address"
            icon="location_on"
            placeholder="Plot 45, Focal Point Phase-5..."
            error={errors.address}
            {...register('address')}
          />
          <div className="flex justify-end gap-md pt-md border-t border-outline-variant">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-lg py-sm border border-outline text-on-surface rounded-lg hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-lg py-sm bg-primary-container text-on-primary-container font-semibold rounded-lg shadow-[0_2px_0_0_rgba(116,91,0,0.5)] hover:opacity-90 active:scale-95 transition-all"
            >
              Save Vendor
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutate(deletingVendorId)}
        title="Delete Vendor"
        message="Are you sure you want to delete this vendor from the database? This action is irreversible."
        confirmText="Delete Supplier"
        isDanger
      />
    </PageWrapper>
  );
};

export default VendorListPage;
