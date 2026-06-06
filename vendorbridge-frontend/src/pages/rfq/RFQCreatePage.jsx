import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createRFQ, uploadRFQAttachment } from '../../api/rfqApi';
import { getVendors, isAssignableVendor } from '../../api/vendorApi';
import PageWrapper from '../../components/layout/PageWrapper';
import FormInput from '../../components/forms/FormInput';
import FormTextarea from '../../components/forms/FormTextarea';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const rfqSchema = zod.object({
  title: zod.string().min(1, 'Title is required'),
  description: zod.string().min(1, 'Description is required'),
  deadline: zod.string().min(1, 'Deadline date is required'),
  items: zod.array(zod.object({
    item_name: zod.string().min(1, 'Item name is required'),
    description: zod.string().optional(),
    quantity: zod.number().min(1, 'Quantity must be at least 1'),
    unit: zod.string().min(1, 'Unit is required')
  })).min(1, 'At least one item row is required')
});

const RFQCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [assignedVendors, setAssignedVendors] = useState([]);
  const [file, setFile] = useState(null);

  const { data: vendors = [], isLoading: isVendorsLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: getVendors
  });

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      title: '',
      description: '',
      deadline: '',
      items: [{ item_name: '', description: '', quantity: 1, unit: 'Units' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const createRfqMutation = useMutation({
    mutationFn: createRFQ,
    onSuccess: async (data) => {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
          await uploadRFQAttachment(data.id, formData);
        } catch (err) {
          toast.error('RFQ created, but attachment failed to upload.');
        }
      }
      queryClient.invalidateQueries({ queryKey: ['rfqs'] });
      toast.success('RFQ created successfully!');
      navigate('/rfqs');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create RFQ');
    }
  });

  const onSubmit = (data) => {
    if (assignedVendors.length === 0) {
      toast.error('Please assign at least one vendor to this RFQ.');
      return;
    }
    createRfqMutation.mutate({
      ...data,
      vendors: assignedVendors
    });
  };

  const handleVendorToggle = (vendorId) => {
    setAssignedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId) 
        : [...prev, vendorId]
    );
  };

  if (isVendorsLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <PageWrapper
      title="Create New RFQ"
      description="Publish a Request for Quotation and assign matching vendor participants."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-lg mt-md max-w-4xl">
        <div className="bg-surface p-lg rounded-xl border border-outline-variant card-shadow space-y-lg">
          <h3 className="font-headline-sm text-headline-sm pb-sm border-b border-outline-variant">RFQ Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="space-y-lg">
              <FormInput
                label="RFQ Title"
                icon="title"
                placeholder="e.g. High-Grade Steel Sheets Procurement"
                error={errors.title}
                {...register('title')}
              />
              <FormInput
                label="Deadline Date"
                type="date"
                icon="calendar_today"
                error={errors.deadline}
                {...register('deadline')}
              />
            </div>
            <FormTextarea
              label="RFQ Description"
              icon="description"
              placeholder="Describe the scope, quality standard, and shipping expectations..."
              rows={5}
              error={errors.description}
              {...register('description')}
            />
          </div>
        </div>

        {/* Dynamic Item List */}
        <div className="bg-surface p-lg rounded-xl border border-outline-variant card-shadow space-y-lg">
          <div className="flex justify-between items-center pb-sm border-b border-outline-variant">
            <h3 className="font-headline-sm text-headline-sm">Line Items</h3>
            <button
              type="button"
              onClick={() => append({ item_name: '', description: '', quantity: 1, unit: 'Units' })}
              className="text-primary font-bold hover:underline flex items-center gap-xs text-sm"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              Add Row
            </button>
          </div>
          <div className="space-y-md">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-md items-end bg-surface-container-low p-md rounded-lg border border-outline-variant relative">
                <div className="md:col-span-4">
                  <FormInput
                    label={index === 0 ? "Item Name" : ""}
                    placeholder="e.g. High-Grade Steel Sheet"
                    error={errors.items?.[index]?.item_name}
                    {...register(`items.${index}.item_name`)}
                  />
                </div>
                <div className="md:col-span-4">
                  <FormInput
                    label={index === 0 ? "Specification" : ""}
                    placeholder="e.g. 4mm thickness, 2mx1m"
                    error={errors.items?.[index]?.description}
                    {...register(`items.${index}.description`)}
                  />
                </div>
                <div className="md:col-span-2">
                  <FormInput
                    label={index === 0 ? "Qty" : ""}
                    type="number"
                    placeholder="100"
                    error={errors.items?.[index]?.quantity}
                    {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                  />
                </div>
                <div className="md:col-span-1">
                  <FormInput
                    label={index === 0 ? "Unit" : ""}
                    placeholder="Sheets"
                    error={errors.items?.[index]?.unit}
                    {...register(`items.${index}.unit`)}
                  />
                </div>
                <div className="md:col-span-1 text-center">
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-error hover:text-red-700 w-10 h-10 flex items-center justify-center rounded hover:bg-error-container"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendor Selection */}
        <div className="bg-surface p-lg rounded-xl border border-outline-variant card-shadow space-y-lg">
          <h3 className="font-headline-sm text-headline-sm pb-sm border-b border-outline-variant">Assign Suppliers</h3>
          <div className="space-y-md">
            <p className="text-sm text-on-surface-variant">
              Choose one or more active vendors to receive this RFQ.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md max-h-72 overflow-y-auto custom-scrollbar">
              {vendors.filter(isAssignableVendor).map((vendor) => (
                <label
                  key={vendor.id}
                  className={`flex items-center gap-md p-md border rounded-xl cursor-pointer hover:bg-surface-container transition-colors ${
                    assignedVendors.includes(vendor.id) ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant bg-surface-container-lowest'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={assignedVendors.includes(vendor.id)}
                    onChange={() => handleVendorToggle(vendor.id)}
                    className="w-5 h-5 rounded border-outline text-primary focus:ring-primary-container"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-on-surface truncate">{vendor.companyName || vendor.company_name}</p>
                    <p className="text-xs text-on-surface-variant font-label-sm truncate">
                      {(vendor.category?.categoryName || vendor.categoryName || vendor.category_name || 'Uncategorized')} | Rating: {vendor.rating ?? 0}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            {vendors.filter(isAssignableVendor).length === 0 && (
              <div className="rounded-lg border border-dashed border-outline-variant p-md text-sm text-on-surface-variant">
                No assignable vendors are available right now. Make sure vendors are created with an active or verified status.
              </div>
            )}
          </div>
        </div>

        {/* Attachments */}
        <div className="bg-surface p-lg rounded-xl border border-outline-variant card-shadow space-y-lg">
          <h3 className="font-headline-sm text-headline-sm pb-sm border-b border-outline-variant">Technical Specifications</h3>
          <div className="flex items-center justify-center border-2 border-dashed border-outline rounded-xl p-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer relative">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="text-center">
              <span className="material-symbols-outlined text-[40px] text-outline mb-sm">cloud_upload</span>
              <p className="font-bold text-on-surface">{file ? file.name : 'Upload specification sheet / drawing'}</p>
              <p className="text-xs text-on-surface-variant mt-xs">PDF or CAD drawing up to 10MB</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-md">
          <button
            type="button"
            onClick={() => navigate('/rfqs')}
            className="px-lg py-md border border-outline text-on-surface rounded-lg hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-lg py-md bg-primary-container text-on-primary-container font-semibold rounded-lg shadow-[0_2px_0_0_rgba(116,91,0,0.5)] hover:opacity-90 active:scale-95 transition-all"
          >
            Publish Request
          </button>
        </div>
      </form>
    </PageWrapper>
  );
};

export default RFQCreatePage;
