import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import toast from 'react-hot-toast';
import { getUsers, createUser, updateUser, deleteUser } from '../../api/userApi';
import PageWrapper from '../../components/layout/PageWrapper';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';

const userSchema = zod.object({
  firstName: zod.string().min(1, 'First name is required'),
  lastName: zod.string().min(1, 'Last name is required'),
  email: zod.string().email('Invalid email address'),
  phone: zod.string().min(10, 'Phone must be at least 10 digits'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
  role: zod.enum(['ADMIN', 'PROCUREMENT_OFFICER', 'VENDOR_MANAGER', 'APPROVER'])
});

const UserManagementPage = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    retry: false,
    staleTime: 0
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully!');
      setIsFormOpen(false);
    },
    onError: (err) => toast.error(err.message || 'Failed to create user')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully!');
    },
    onError: (err) => toast.error(err.message || 'Failed to update user')
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully!');
    },
    onError: (err) => toast.error(err.message || 'Failed to delete user')
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', password: '', role: 'PROCUREMENT_OFFICER' }
  });

  const handleOpenAdd = () => {
    reset();
    setIsFormOpen(true);
  };

  const handleOpenDelete = (id) => {
    setDeletingUserId(id);
    setIsDeleteOpen(true);
  };

  const handleStatusToggle = (user) => {
    const currentStatusNormalized = (user.status || '').toUpperCase();
    const newStatus = currentStatusNormalized === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    updateMutation.mutate({ id: user.id, data: { status: newStatus } });
  };

  const handleRoleChange = (userId, newRole) => {
    updateMutation.mutate({ id: userId, data: { role: newRole } });
  };

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

  const columns = [
    {
      header: 'User Name',
      accessor: 'firstName',
      render: (row) => (
        <div>
          <p className="font-semibold text-on-surface">{row.firstName} {row.lastName}</p>
          <p className="text-xs text-on-surface-variant font-label-sm">{row.email}</p>
        </div>
      )
    },
    { header: 'Phone', accessor: 'phone' },
    {
      header: 'Assigned Role',
      accessor: 'role',
      render: (row) => (
        <select
          value={row.role}
          onChange={(e) => handleRoleChange(row.id, e.target.value)}
          className="border border-outline-variant rounded px-md py-sm bg-surface text-body-sm font-semibold focus:ring-1 focus:ring-primary-container outline-none"
        >
          <option value="ADMIN">ADMIN</option>
          <option value="PROCUREMENT_OFFICER">PROCUREMENT OFFICER</option>
          <option value="VENDOR_MANAGER">VENDOR / SUPPLIER</option>
          <option value="APPROVER">MANAGER / APPROVER</option>
        </select>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <button
          onClick={() => handleStatusToggle(row)}
          className="hover:opacity-80 transition-opacity"
          title="Toggle Status"
        >
          <StatusBadge status={row.status} />
        </button>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      align: 'right',
      render: (row) => (
        <div className="flex justify-end gap-sm">
          <button
            onClick={() => handleOpenDelete(row.id)}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-error-container hover:text-on-error-container transition-colors text-on-surface-variant"
            title="Delete User"
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <PageWrapper
      title="User Management Console"
      description={`Activate accounts, update profiles, and manage role security tags for ${users.length} users.`}
      actions={
        <button
          onClick={handleOpenAdd}
          className="bg-primary-container text-on-primary-container font-semibold px-lg py-md rounded-lg flex items-center gap-md btn-primary-shadow hover:opacity-90 active:scale-95 transition-all w-full sm:w-auto justify-center"
        >
          <span className="material-symbols-outlined">person_add</span>
          Add New User
        </button>
      }
    >
      <div className="mt-md">
        <DataTable columns={columns} data={users} isLoading={isLoading} />
      </div>

      {/* Add User Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Create ERP User Profile">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-lg py-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <FormInput
              label="First Name"
              icon="person"
              placeholder="John"
              error={errors.firstName}
              {...register('firstName')}
            />
            <FormInput
              label="Last Name"
              icon="person"
              placeholder="Doe"
              error={errors.lastName}
              {...register('lastName')}
            />
          </div>
          <FormInput
            label="Email Address"
            type="email"
            icon="mail"
            placeholder="johndoe@company.com"
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
          <FormInput
            label="Password"
            type="password"
            icon="lock"
            placeholder="Create a temporary password"
            error={errors.password}
            {...register('password')}
          />
          <FormSelect
            label="Security Role"
            icon="shield"
            options={[
              { value: 'PROCUREMENT_OFFICER', label: 'Procurement Officer' },
              { value: 'VENDOR_MANAGER', label: 'Vendor / Supplier' },
              { value: 'APPROVER', label: 'Manager / Approver' },
              { value: 'ADMIN', label: 'Administrator' }
            ]}
            error={errors.role}
            {...register('role')}
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
              Create Profile
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutate(deletingUserId)}
        title="Delete User"
        message="Are you sure you want to delete this user profile? The user will immediately lose access to the system."
        confirmText="Delete User"
        isDanger
      />
    </PageWrapper>
  );
};

export default UserManagementPage;
