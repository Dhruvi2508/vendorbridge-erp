package com.vendorbridge.vendorbridgeerp.service;

import com.vendorbridge.vendorbridgeerp.dto.request.QuotationRequest;
import com.vendorbridge.vendorbridgeerp.dto.response.QuotationResponse;

import java.util.List;

public interface QuotationService {
    QuotationResponse createQuotation(QuotationRequest request);
    List<QuotationResponse> getAllQuotations();
    QuotationResponse getQuotationById(Long id);
    QuotationResponse updateQuotation(Long id, QuotationRequest request);
    void deleteQuotation(Long id);
    List<QuotationResponse> getQuotationsByRfq(Long rfqId);
    List<QuotationResponse> compareQuotations(Long rfqId);
}
