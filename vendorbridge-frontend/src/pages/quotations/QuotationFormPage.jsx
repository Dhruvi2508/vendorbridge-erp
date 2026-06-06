import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getRFQById, getRFQs } from '../../api/rfqApi';
import { createQuotation } from '../../api/quotationApi';
import PageWrapper from '../../components/layout/PageWrapper';
import FormInput from '../../components/forms/FormInput';
import FormTextarea from '../../components/forms/FormTextarea';
import FormSelect from '../../components/forms/FormSelect';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';

const quoteSchema = zod.object({
  rfq_id: zod.string().min(1, 'Please select an RFQ'),
  delivery_days: zod.number().min(1, 'Delivery days must be at least 1'),
  notes: zod.string().optional(),
  items: zod.array(zod.object({
    item_name: zod.string(),
    quantity: zod.number(),
    unit_price: zod.number().min(0.01, 'Price must be greater than 0')
  }))
});

const QuotationFormPage = () => {
  const { rfqId } = useParams();
  const navigate = useNavigate();
  const [selectedRfqId, setSelectedRfqId] = useState(rfqId || '');

  const { data: activeRfqs = [], isLoading: isRfqsLoading } = useQuery({
    queryKey: ['activeRfqs'],
    queryFn: getRFQs
  });

  const { data: selectedRfq, isLoading: isRfqLoading } = useQuery({
    queryKey: ['rfqDetail', selectedRfqId],
    queryFn: () => getRFQById(selectedRfqId),
    enabled: !!selectedRfqId
  });

  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues: { rfq_id: selectedRfqId, delivery_days: 7, notes: '', items: [] }
  });

  const { fields, replace } = useFieldArray({ control, name: 'items' });

  useEffect(() => {
    if (selectedRfq) {
      const formItems = selectedRfq.items?.map((item) => ({
        item_name: item.item_name,
        quantity: item.quantity,
        unit_price: 0
      })) || [];
      replace(formItems);
    }
  }, [selectedRfq, replace]);

  const handleRfqChange = (e) => {
    setSelectedRfqId(e.target.value);
    reset({ rfq_id: e.target.value, delivery_days: 7, notes: '', items: [] });
  };

  const submitMutation = useMutation({
    mutationFn: createQuotation,
    onSuccess: () => {
      toast.success('Quotation submitted successfully!');
      navigate('/quotations');
    },
    onError: (err) => {
      toast.error(err.message || 'Submission failed');
    }
  });

  const watchedItems = watch('items') || [];
  const totalAmount = watchedItems.reduce((acc, curr) => {
    const qty = curr.quantity || 0;
    const price = curr.unit_price || 0;
    return acc + (qty * price);
  }, 0);

  const onSubmit = (data) => {
    submitMutation.mutate({
      rfq_id: parseInt(data.rfq_id),
      vendor_id: 3, // Mock Vendor Profile ID
      delivery_days: data.delivery_days,
      notes: data.notes,
      total_amount: totalAmount,
      items: data.items.map(item => ({
        item_name: item.item_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price
      }))
    });
  };

  if (isRfqsLoading || (selectedRfqId && isRfqLoading)) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <PageWrapper
      title="Submit Quotation"
      description="Enter component pricing, lead times, and terms for assigned RFQ bids."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-lg mt-md max-w-3xl">
        <div className="bg-surface p-lg rounded-xl border border-outline-variant card-shadow space-y-lg">
          <h3 className="font-headline-sm text-headline-sm pb-sm border-b border-outline-variant">Bid Selection</h3>
          {!rfqId ? (
            <FormSelect
              label="Select RFQ"
              icon="request_quote"
              value={selectedRfqId}
              onChange={handleRfqChange}
              options={[
                { value: '', label: 'Select Assigned RFQ' },
                ...activeRfqs.filter(r => r.status === 'OPEN').map(r => ({ value: String(r.id), label: `${r.title} (${r.rfq_number})` }))
              ]}
              error={errors.rfq_id}
            />
          ) : (
            <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant">
              <span className="font-semibold block text-sm">Responding to</span>
              <p className="font-headline-sm text-primary font-bold">{selectedRfq?.title}</p>
              <p className="text-xs text-on-surface-variant font-label-sm mt-xs">RFQ Reference: {selectedRfq?.rfq_number} | Deadline: {formatDate(selectedRfq?.deadline)}</p>
            </div>
          )}
        </div>

        {selectedRfq && (
          <>
            <div className="bg-surface p-lg rounded-xl border border-outline-variant card-shadow space-y-lg">
              <h3 className="font-headline-sm text-headline-sm pb-sm border-b border-outline-variant">Itemized Bidding</h3>
              <div className="space-y-md">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-md items-center bg-surface-container-low p-md rounded-lg border border-outline-variant">
                    <div className="md:col-span-5">
                      <p className="font-bold text-on-surface">{field.item_name}</p>
                      <p className="text-xs text-on-surface-variant">Qty: {field.quantity}</p>
                    </div>
                    <div className="md:col-span-4">
                      <FormInput
                        label="Unit Price ($)"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        error={errors.items?.[index]?.unit_price}
                        {...register(`items.${index}.unit_price`, { valueAsNumber: true })}
                      />
                    </div>
                    <div className="md:col-span-3 text-right">
                      <span className="text-xs text-on-surface-variant block uppercase font-label-sm">Subtotal</span>
                      <span className="font-bold text-on-surface font-label-md">
                        {formatCurrency((watchedItems[index]?.unit_price || 0) * field.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-md border-t border-outline-variant flex justify-between items-center bg-surface-container-low p-md rounded-lg">
                <span className="font-headline-sm text-headline-sm">Grand Total Bid</span>
                <span className="font-headline-md text-headline-md text-primary font-label-md">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <div className="bg-surface p-lg rounded-xl border border-outline-variant card-shadow space-y-lg">
              <h3 className="font-headline-sm text-headline-sm pb-sm border-b border-outline-variant">Lead Time & Remarks</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                <div className="md:col-span-1">
                  <FormInput
                    label="Delivery Days"
                    type="number"
                    icon="local_shipping"
                    placeholder="10"
                    error={errors.delivery_days}
                    {...register('delivery_days', { valueAsNumber: true })}
                  />
                </div>
                <div className="md:col-span-2">
                  <FormTextarea
                    label="Proposal Notes"
                    icon="rate_review"
                    placeholder="Specify warranty conditions, custom specifications, or packaging parameters..."
                    error={errors.notes}
                    {...register('notes')}
                  />
                </div>
              </div>
            </div>

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
                className="px-lg py-md bg-primary text-on-primary font-semibold rounded-lg shadow-[0_2px_0_0_rgba(116,91,0,0.5)] hover:opacity-90 active:scale-95 transition-all"
              >
                Submit Proposal
              </button>
            </div>
          </>
        )}
      </form>
    </PageWrapper>
  );
};

export default QuotationFormPage;
