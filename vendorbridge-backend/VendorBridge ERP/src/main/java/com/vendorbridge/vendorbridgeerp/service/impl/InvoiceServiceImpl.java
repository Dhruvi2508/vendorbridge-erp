package com.vendorbridge.vendorbridgeerp.service.impl;

import com.vendorbridge.vendorbridgeerp.dto.request.InvoiceRequest;
import com.vendorbridge.vendorbridgeerp.dto.response.InvoiceResponse;
import com.vendorbridge.vendorbridgeerp.entity.*;
import com.vendorbridge.vendorbridgeerp.enums.InvoiceStatus;
import com.vendorbridge.vendorbridgeerp.repository.InvoiceRepository;
import com.vendorbridge.vendorbridgeerp.repository.InvoiceItemRepository;
import com.vendorbridge.vendorbridgeerp.repository.VendorRepository;
import com.vendorbridge.vendorbridgeerp.repository.PurchaseOrderRepository;
import com.vendorbridge.vendorbridgeerp.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceItemRepository invoiceItemRepository;
    private final VendorRepository vendorRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    @Override
    @Transactional
    public InvoiceResponse createInvoice(InvoiceRequest request) {
        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found with id: " + request.getVendorId()));

        PurchaseOrder po = null;
        if (request.getPurchaseOrderId() != null) {
            po = purchaseOrderRepository.findById(request.getPurchaseOrderId())
                    .orElseThrow(() -> new IllegalArgumentException("Purchase Order not found with id: " + request.getPurchaseOrderId()));
        }

        BigDecimal paid = request.getPaidAmount() != null ? request.getPaidAmount() : BigDecimal.ZERO;
        BigDecimal balance = request.getBalanceAmount() != null ? request.getBalanceAmount() : request.getTotalAmount().subtract(paid);

        Invoice invoice = Invoice.builder()
                .invoiceNumber(request.getInvoiceNumber())
                .status(InvoiceStatus.APPROVED)
                .invoiceDate(LocalDate.now())
                .dueDate(LocalDate.now().plusDays(30))
                .currency(request.getCurrency())
                .subTotal(request.getSubTotal())
                .taxAmount(request.getTaxAmount())
                .discountAmount(request.getDiscountAmount())
                .totalAmount(request.getTotalAmount())
                .paidAmount(paid)
                .balanceAmount(balance)
                .paymentMethod(request.getPaymentMethod())
                .notes(request.getNotes())
                .vendor(vendor)
                .purchaseOrder(po)
                .build();

        Invoice savedInvoice = invoiceRepository.save(invoice);

        // Copy items from Purchase Order if available
        if (po != null && po.getPurchaseOrderItems() != null) {
            for (PurchaseOrderItem poItem : po.getPurchaseOrderItems()) {
                InvoiceItem invItem = InvoiceItem.builder()
                        .itemName(poItem.getItemName())
                        .itemCode(poItem.getItemCode())
                        .description(poItem.getDescription())
                        .quantity(poItem.getQuantityOrdered())
                        .unitOfMeasure(poItem.getUnitOfMeasure())
                        .unitPrice(poItem.getUnitPrice())
                        .taxRate(poItem.getTaxRate())
                        .taxAmount(poItem.getTaxAmount())
                        .discountRate(poItem.getDiscountRate())
                        .discountAmount(poItem.getDiscountAmount())
                        .totalPrice(poItem.getTotalPrice())
                        .sequenceNumber(poItem.getSequenceNumber())
                        .invoice(savedInvoice)
                        .purchaseOrderItem(poItem)
                        .build();

                invoiceItemRepository.save(invItem);
            }
        }

        return mapToInvoiceResponse(savedInvoice);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponse> getAllInvoices() {
        return invoiceRepository.findAll().stream()
                .map(this::mapToInvoiceResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found with id: " + id));
        return mapToInvoiceResponse(invoice);
    }

    @Override
    @Transactional
    public InvoiceResponse updateInvoice(Long id, InvoiceRequest request) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found with id: " + id));

        invoice.setInvoiceNumber(request.getInvoiceNumber());
        invoice.setCurrency(request.getCurrency());
        invoice.setSubTotal(request.getSubTotal());
        invoice.setTaxAmount(request.getTaxAmount());
        invoice.setDiscountAmount(request.getDiscountAmount());
        invoice.setTotalAmount(request.getTotalAmount());

        BigDecimal paid = request.getPaidAmount() != null ? request.getPaidAmount() : invoice.getPaidAmount();
        invoice.setPaidAmount(paid);
        invoice.setBalanceAmount(request.getBalanceAmount() != null ? request.getBalanceAmount() : request.getTotalAmount().subtract(paid));

        invoice.setPaymentMethod(request.getPaymentMethod());
        invoice.setNotes(request.getNotes());

        Invoice updated = invoiceRepository.save(invoice);
        return mapToInvoiceResponse(updated);
    }

    private InvoiceResponse mapToInvoiceResponse(Invoice invoice) {
        return InvoiceResponse.builder()
                .id(invoice.getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .vendorId(invoice.getVendor() != null ? invoice.getVendor().getId() : null)
                .purchaseOrderId(invoice.getPurchaseOrder() != null ? invoice.getPurchaseOrder().getId() : null)
                .totalAmount(invoice.getTotalAmount())
                .paidAmount(invoice.getPaidAmount())
                .balanceAmount(invoice.getBalanceAmount())
                .status(invoice.getStatus() != null ? invoice.getStatus().name() : null)
                .build();
    }
}
