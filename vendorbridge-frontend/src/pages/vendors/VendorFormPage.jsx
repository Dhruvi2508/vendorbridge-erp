import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getVendorById, createVendor, updateVendor, getCategories } from '../../api/vendorApi';
import PageWrapper from '../../components/layout/PageWrapper';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import FormTextarea from '../../components/forms/FormTextarea';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const vendorFormSchema = zod.object({
  company_name: zod.string().min(1, 'Company name is required'),
  gst_number: zod.string().min(15, 'GST number must be 15 characters').max(15, 'GST number must be 15 characters'),
  contact_person: zod.string().min(1, 'Contact person is required'),
  email: zod.string().email('Invalid email address'),
  phone: zod.string().min(10, 'Phone must be at least 10 digits'),
  address: zod.string().min(1, 'Address is required'),
  category_id: zod.string().min(1, 'Category is required')
});

const VendorFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const { data: vendor, isLoading } = useQuery({
    queryKey: ['vendor', id],
    queryFn: () => getVendorById(id),
    enabled: isEdit
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: { company_name: '', gst_number: '', contact_person: '', email: '', phone: '', address: '', category_id: '' }
  });

  useEffect(() => {
    if (vendor) {
      reset({
        company_name: vendor.company_name,
        gst_number: vendor.gst_number,
        contact_person: vendor.contact_person,
        email: vendor.email,
        phone: vendor.phone,
        address: vendor.address,
        category_id: String(vendor.category_id || '')
      });
    }
  }, [vendor, reset]);

  const mutation = useMutation({
    mutationFn: (data) => isEdit ? updateVendor(id, data) : createVendor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success(isEdit ? 'Vendor updated!' : 'Vendor created!');
      navigate('/vendors');
    },
    onError: (err) => {
      toast.error(err.message || 'Operation failed');
    }
  });

  if (isEdit && isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <PageWrapper
      title={isEdit ? 'Edit Vendor Profile' : 'Add New Vendor'}
      description="Update supplier contact information, categories, and tax registrations."
    >
      <div className="bg-surface p-lg rounded-xl border border-outline-variant max-w-xl card-shadow mt-md">
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-lg">
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
              ...categories.map((c) => ({ value: String(c.id), label: c.category_name || c.categoryName }))
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
              onClick={() => navigate('/vendors')}
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
      </div>
    </PageWrapper>
  );
};

export default VendorFormPage;
