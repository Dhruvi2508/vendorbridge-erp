package com.vendorbridge.vendorbridgeerp.service.impl;

import com.vendorbridge.vendorbridgeerp.dto.request.PurchaseOrderRequest;
import com.vendorbridge.vendorbridgeerp.dto.response.PurchaseOrderResponse;
import com.vendorbridge.vendorbridgeerp.entity.*;
import com.vendorbridge.vendorbridgeerp.enums.PurchaseOrderStatus;
import com.vendorbridge.vendorbridgeerp.repository.PurchaseOrderRepository;
import com.vendorbridge.vendorbridgeerp.repository.PurchaseOrderItemRepository;
import com.vendorbridge.vendorbridgeerp.repository.VendorRepository;
import com.vendorbridge.vendorbridgeerp.repository.QuotationRepository;
import com.vendorbridge.vendorbridgeerp.repository.UserRepository;
import com.vendorbridge.vendorbridgeerp.service.PurchaseOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PurchaseOrderItemRepository purchaseOrderItemRepository;
    private final VendorRepository vendorRepository;
    private final QuotationRepository quotationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public PurchaseOrderResponse createPurchaseOrder(PurchaseOrderRequest request) {
        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found with id: " + request.getVendorId()));

        Quotation quotation = null;
        if (request.getQuotationId() != null) {
            quotation = quotationRepository.findById(request.getQuotationId())
                    .orElseThrow(() -> new IllegalArgumentException("Quotation not found with id: " + request.getQuotationId()));
        }

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User creator = userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new IllegalArgumentException("No users available to assign as PO creator")));

        PurchaseOrder po = PurchaseOrder.builder()
                .poNumber(request.getPoNumber())
                .status(PurchaseOrderStatus.APPROVED)
                .poDate(LocalDate.now())
                .expectedDeliveryDate(LocalDate.now().plusDays(10))
                .currency(request.getCurrency())
                .subTotal(request.getSubTotal())
                .taxAmount(request.getTaxAmount())
                .discountAmount(request.getDiscountAmount())
                .totalAmount(request.getTotalAmount())
                .paymentTerms(request.getPaymentTerms())
                .deliveryAddress(request.getDeliveryAddress())
                .termsAndConditions(request.getTermsAndConditions())
                .notes(request.getNotes())
                .vendor(vendor)
                .quotation(quotation)
                .createdBy(creator)
                .build();

        PurchaseOrder savedPo = purchaseOrderRepository.save(po);

        // Copy items from quotation if available
        if (quotation != null && quotation.getQuotationItems() != null) {
            for (QuotationItem qItem : quotation.getQuotationItems()) {
                PurchaseOrderItem poItem = PurchaseOrderItem.builder()
                        .itemName(qItem.getItemName())
                        .itemCode(qItem.getItemCode())
                        .description(qItem.getDescription())
                        .quantityOrdered(qItem.getQuantity())
                        .quantityReceived(BigDecimal.ZERO)
                        .unitOfMeasure(qItem.getUnitOfMeasure())
                        .unitPrice(qItem.getUnitPrice())
                        .taxRate(qItem.getTaxRate())
                        .taxAmount(qItem.getTaxAmount())
                        .discountRate(qItem.getDiscountRate())
                        .discountAmount(qItem.getDiscountAmount())
                        .totalPrice(qItem.getTotalPrice())
                        .sequenceNumber(qItem.getSequenceNumber())
                        .purchaseOrder(savedPo)
                        .rfqItem(qItem.getRfqItem())
                        .quotationItem(qItem)
                        .build();

                purchaseOrderItemRepository.save(poItem);
            }
        }

        return mapToPurchaseOrderResponse(savedPo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrderResponse> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll().stream()
                .map(this::mapToPurchaseOrderResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseOrderResponse getPurchaseOrderById(Long id) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Purchase Order not found with id: " + id));
        return mapToPurchaseOrderResponse(po);
    }

    @Override
    @Transactional
    public PurchaseOrderResponse updatePurchaseOrder(Long id, PurchaseOrderRequest request) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Purchase Order not found with id: " + id));

        po.setPoNumber(request.getPoNumber());
        po.setCurrency(request.getCurrency());
        po.setSubTotal(request.getSubTotal());
        po.setTaxAmount(request.getTaxAmount());
        po.setDiscountAmount(request.getDiscountAmount());
        po.setTotalAmount(request.getTotalAmount());
        po.setPaymentTerms(request.getPaymentTerms());
        po.setDeliveryAddress(request.getDeliveryAddress());
        po.setTermsAndConditions(request.getTermsAndConditions());
        po.setNotes(request.getNotes());

        PurchaseOrder updated = purchaseOrderRepository.save(po);
        return mapToPurchaseOrderResponse(updated);
    }

    private PurchaseOrderResponse mapToPurchaseOrderResponse(PurchaseOrder po) {
        return PurchaseOrderResponse.builder()
                .id(po.getId())
                .poNumber(po.getPoNumber())
                .vendorId(po.getVendor() != null ? po.getVendor().getId() : null)
                .quotationId(po.getQuotation() != null ? po.getQuotation().getId() : null)
                .totalAmount(po.getTotalAmount())
                .status(po.getStatus() != null ? po.getStatus().name() : null)
                .build();
    }
}
