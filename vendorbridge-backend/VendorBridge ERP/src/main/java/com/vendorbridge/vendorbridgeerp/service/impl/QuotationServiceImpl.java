package com.vendorbridge.vendorbridgeerp.service.impl;

import com.vendorbridge.vendorbridgeerp.dto.request.QuotationRequest;
import com.vendorbridge.vendorbridgeerp.dto.request.QuotationItemRequest;
import com.vendorbridge.vendorbridgeerp.dto.response.QuotationResponse;
import com.vendorbridge.vendorbridgeerp.entity.*;
import com.vendorbridge.vendorbridgeerp.enums.QuotationStatus;
import com.vendorbridge.vendorbridgeerp.repository.*;
import com.vendorbridge.vendorbridgeerp.service.QuotationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuotationServiceImpl implements QuotationService {

    private final QuotationRepository quotationRepository;
    private final QuotationItemRepository quotationItemRepository;
    private final RfqRepository rfqRepository;
    private final VendorRepository vendorRepository;
    private final RfqItemRepository rfqItemRepository;

    @Override
    @Transactional
    public QuotationResponse createQuotation(QuotationRequest request) {
        Rfq rfq = rfqRepository.findById(request.getRfqId())
                .orElseThrow(() -> new IllegalArgumentException("RFQ not found with id: " + request.getRfqId()));
        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found with id: " + request.getVendorId()));

        Quotation quotation = Quotation.builder()
                .quotationNumber(request.getQuotationNumber())
                .status(QuotationStatus.SUBMITTED)
                .submissionDate(LocalDate.now())
                .validityDate(LocalDate.now().plusDays(30))
                .currency(request.getCurrency())
                .subTotal(request.getSubTotal())
                .taxAmount(request.getTaxAmount())
                .discountAmount(request.getDiscountAmount())
                .totalAmount(request.getTotalAmount())
                .deliveryDays(request.getDeliveryDays())
                .paymentTerms(request.getPaymentTerms())
                .notes(request.getNotes())
                .rfq(rfq)
                .vendor(vendor)
                .build();

        Quotation savedQuotation = quotationRepository.save(quotation);

        if (request.getItems() != null) {
            for (QuotationItemRequest itemReq : request.getItems()) {
                RfqItem rfqItem = null;
                if (itemReq.getRfqItemId() != null) {
                    rfqItem = rfqItemRepository.findById(itemReq.getRfqItemId()).orElse(null);
                }

                QuotationItem item = QuotationItem.builder()
                        .itemName(itemReq.getItemName())
                        .itemCode(itemReq.getItemCode())
                        .description(itemReq.getDescription())
                        .quantity(itemReq.getQuantity())
                        .unitOfMeasure(itemReq.getUnitOfMeasure())
                        .unitPrice(itemReq.getUnitPrice())
                        .taxRate(itemReq.getTaxRate())
                        .taxAmount(itemReq.getTaxAmount())
                        .discountRate(itemReq.getDiscountRate())
                        .discountAmount(itemReq.getDiscountAmount())
                        .totalPrice(itemReq.getTotalPrice())
                        .deliveryDays(itemReq.getDeliveryDays())
                        .sequenceNumber(itemReq.getSequenceNumber())
                        .quotation(savedQuotation)
                        .rfqItem(rfqItem)
                        .build();

                quotationItemRepository.save(item);
            }
        }

        return mapToQuotationResponse(savedQuotation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuotationResponse> getAllQuotations() {
        return quotationRepository.findAll().stream()
                .map(this::mapToQuotationResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public QuotationResponse getQuotationById(Long id) {
        Quotation quotation = quotationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Quotation not found with id: " + id));
        return mapToQuotationResponse(quotation);
    }

    @Override
    @Transactional
    public QuotationResponse updateQuotation(Long id, QuotationRequest request) {
        Quotation quotation = quotationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Quotation not found with id: " + id));

        quotation.setQuotationNumber(request.getQuotationNumber());
        quotation.setCurrency(request.getCurrency());
        quotation.setSubTotal(request.getSubTotal());
        quotation.setTaxAmount(request.getTaxAmount());
        quotation.setDiscountAmount(request.getDiscountAmount());
        quotation.setTotalAmount(request.getTotalAmount());
        quotation.setDeliveryDays(request.getDeliveryDays());
        quotation.setPaymentTerms(request.getPaymentTerms());
        quotation.setNotes(request.getNotes());

        Quotation updated = quotationRepository.save(quotation);
        return mapToQuotationResponse(updated);
    }

    @Override
    @Transactional
    public void deleteQuotation(Long id) {
        if (!quotationRepository.existsById(id)) {
            throw new IllegalArgumentException("Quotation not found with id: " + id);
        }
        quotationRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuotationResponse> getQuotationsByRfq(Long rfqId) {
        return quotationRepository.findByRfqId(rfqId).stream()
                .map(this::mapToQuotationResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuotationResponse> compareQuotations(Long rfqId) {
        List<Quotation> quotations = quotationRepository.findByRfqId(rfqId);

        // Sort by totalAmount ascending, then deliveryDays ascending
        return quotations.stream()
                .sorted(Comparator.comparing(Quotation::getTotalAmount, Comparator.nullsLast(Comparator.naturalOrder()))
                        .thenComparing(Quotation::getDeliveryDays, Comparator.nullsLast(Comparator.naturalOrder())))
                .map(this::mapToQuotationResponse)
                .toList();
    }

    private QuotationResponse mapToQuotationResponse(Quotation quotation) {
        return QuotationResponse.builder()
                .id(quotation.getId())
                .quotationNumber(quotation.getQuotationNumber())
                .rfqId(quotation.getRfq() != null ? quotation.getRfq().getId() : null)
                .vendorId(quotation.getVendor() != null ? quotation.getVendor().getId() : null)
                .totalAmount(quotation.getTotalAmount())
                .deliveryDays(quotation.getDeliveryDays())
                .status(quotation.getStatus() != null ? quotation.getStatus().name() : null)
                .build();
    }
}
