package com.vendorbridge.vendorbridgeerp.service;

import com.vendorbridge.vendorbridgeerp.dto.request.InvoiceRequest;
import com.vendorbridge.vendorbridgeerp.dto.response.InvoiceResponse;

import java.util.List;

public interface InvoiceService {
    InvoiceResponse createInvoice(InvoiceRequest request);
    List<InvoiceResponse> getAllInvoices();
    InvoiceResponse getInvoiceById(Long id);
    InvoiceResponse updateInvoice(Long id, InvoiceRequest request);
}
