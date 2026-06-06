import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import { getInvoiceById, sendInvoiceEmail } from '../../api/invoiceApi';
import PageWrapper from '../../components/layout/PageWrapper';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';

const InvoiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoiceRef = useRef(null);

  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => getInvoiceById(id)
  });

  const emailMutation = useMutation({
    mutationFn: (recipientEmail) => sendInvoiceEmail(id, recipientEmail),
    onSuccess: (data) => {
      toast.success(data.message || 'Invoice emailed successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to send invoice email.');
    }
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = invoiceRef.current;
    if (!element) return;
    
    toast.loading('Generating PDF...', { id: 'pdf-generation' });

    html2canvas(element, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Invoice_${invoice.invoice_number}.pdf`);
      toast.dismiss('pdf-generation');
      toast.success('PDF downloaded successfully!');
    }).catch(() => {
      toast.dismiss('pdf-generation');
      toast.error('Failed to generate PDF.');
    });
  };

  const handleSendEmail = () => {
    const emailInput = prompt('Enter recipient email address:', invoice.email || 'accounts@company.com');
    if (emailInput) {
      emailMutation.mutate(emailInput);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!invoice) {
    return (
      <div className="text-center py-2xl">
        <p className="text-on-surface-variant text-body-md">Invoice not found.</p>
        <button onClick={() => navigate('/invoices')} className="text-primary font-bold hover:underline mt-md">Back to Invoices</button>
      </div>
    );
  }

  return (
    <PageWrapper
      title={`Billing Statement`}
      description={`Ref: ${invoice.invoice_number} | Value: ${formatCurrency(invoice.total_amount)}`}
      actions={
        <div className="flex gap-md w-full sm:w-auto flex-wrap print:hidden">
          <button
            onClick={() => navigate('/invoices')}
            className="px-lg py-md border border-outline text-on-surface rounded-lg hover:bg-surface-container transition-colors flex items-center gap-xs text-sm"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back
          </button>
          <button
            onClick={handleSendEmail}
            disabled={emailMutation.isPending}
            className="px-lg py-md border border-outline text-on-surface rounded-lg hover:bg-surface-container transition-colors flex items-center gap-xs text-sm"
          >
            <span className="material-symbols-outlined text-sm">mail</span>
            Send Email
          </button>
          <button
            onClick={handlePrint}
            className="px-lg py-md border border-outline text-on-surface rounded-lg hover:bg-surface-container transition-colors flex items-center gap-xs text-sm"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            Print View
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-primary text-on-primary font-semibold px-lg py-md rounded-lg flex items-center gap-md shadow-[0_2px_0_0_rgba(116,91,0,0.5)] hover:opacity-90 active:scale-95 transition-all text-sm"
          >
            <span className="material-symbols-outlined">download</span>
            Download PDF
          </button>
        </div>
      }
    >
      <div className="bg-surface p-xl rounded-xl border border-outline-variant card-shadow max-w-4xl w-full mx-auto mt-md select-text" ref={invoiceRef} id="invoice-document">
        
        {/* Company Header */}
        <div className="flex justify-between items-start border-b border-outline-variant pb-lg flex-wrap gap-lg">
          <div>
            <div className="flex items-center gap-xs text-primary font-bold">
              <span className="material-symbols-outlined text-[32px]">hub</span>
              <span className="font-headline-sm text-headline-sm">VendorBridge ERP</span>
            </div>
            <p className="text-on-surface-variant font-body-sm text-xs mt-xs">
              Industrial Area, Phase-5, Focal Point,<br />
              Ludhiana, Punjab, India - 141010
            </p>
          </div>
          <div className="text-right">
            <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wide">Invoice</h1>
            <p className="font-label-md text-on-surface mt-xs">{invoice.invoice_number}</p>
            <p className="text-xs text-on-surface-variant mt-xs">Date: {formatDate(invoice.generated_at)}</p>
          </div>
        </div>

        {/* Billing Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg py-lg">
          <div>
            <span className="text-on-surface-variant uppercase font-label-sm text-xs block mb-xs">Billed From</span>
            <p className="font-bold text-on-surface text-sm">{invoice.vendor_name}</p>
            <p className="text-xs text-on-surface-variant mt-xs">
              Verified Partner Supplier Directory<br />
              Authorized GST Tax Registration
            </p>
          </div>
          <div>
            <span className="text-on-surface-variant uppercase font-label-sm text-xs block mb-xs">Billed To (Client)</span>
            <p className="font-bold text-on-surface text-sm">VendorBridge Corporate Accounts</p>
            <p className="text-xs text-on-surface-variant mt-xs">
              Ref Purchase Order: <span className="font-label-md">{invoice.po_number || `PO-${invoice.purchase_order_id}`}</span><br />
              Accounts Clearance Division
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border border-outline-variant rounded-lg overflow-hidden mt-md">
          <table className="w-full text-left border-collapse font-body-sm text-xs">
            <thead className="bg-surface-container border-b border-outline-variant">
              <tr>
                <th className="px-lg py-md text-xs font-label-sm text-on-surface-variant uppercase tracking-wider">Line Item</th>
                <th className="px-lg py-md text-xs font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Qty</th>
                <th className="px-lg py-md text-xs font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Unit Price</th>
                <th className="px-lg py-md text-xs font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {invoice.items?.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-lg py-md font-semibold text-on-surface">{item.item_name}</td>
                  <td className="px-lg py-md text-right font-label-md">{item.quantity}</td>
                  <td className="px-lg py-md text-right font-label-md">{formatCurrency(item.unit_price)}</td>
                  <td className="px-lg py-md text-right font-label-md font-bold">{formatCurrency(item.total_price || (item.quantity * item.unit_price))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tax Breakdown Summary */}
        <div className="flex justify-end mt-lg">
          <div className="w-full sm:w-80 space-y-sm font-body-sm text-sm border-t border-outline-variant pt-md">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Subtotal</span>
              <span className="font-label-sm font-semibold">{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">CGST + SGST (18%)</span>
              <span className="font-label-sm font-semibold">{formatCurrency(invoice.tax_amount)}</span>
            </div>
            <div className="flex justify-between items-center bg-surface-container-low p-md rounded-lg font-bold border border-outline-variant">
              <span className="text-on-surface uppercase text-xs font-label-sm">Total Due (INR)</span>
              <span className="text-primary font-label-sm text-lg">{formatCurrency(invoice.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-xl pt-lg border-t border-outline-variant text-center font-body-sm text-xs text-on-surface-variant">
          <p className="font-bold">Thank you for your business!</p>
          <p className="mt-xs">Standard payment terms apply. Billed in accordance with contract parameters.</p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default InvoiceDetailPage;
