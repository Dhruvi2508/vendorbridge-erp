package com.vendorbridge.vendorbridgeerp.controller;

import com.vendorbridge.vendorbridgeerp.dto.request.QuotationRequest;
import com.vendorbridge.vendorbridgeerp.dto.response.QuotationResponse;
import com.vendorbridge.vendorbridgeerp.service.QuotationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quotations")
@RequiredArgsConstructor
public class QuotationController {

    private final QuotationService quotationService;

    @PostMapping
    public ResponseEntity<QuotationResponse> createQuotation(@RequestBody QuotationRequest request) {
        QuotationResponse response = quotationService.createQuotation(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<QuotationResponse>> getAllQuotations() {
        List<QuotationResponse> responses = quotationService.getAllQuotations();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuotationResponse> getQuotationById(@PathVariable Long id) {
        QuotationResponse response = quotationService.getQuotationById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuotationResponse> updateQuotation(@PathVariable Long id, @RequestBody QuotationRequest request) {
        QuotationResponse response = quotationService.updateQuotation(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuotation(@PathVariable Long id) {
        quotationService.deleteQuotation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/rfq/{rfqId}")
    public ResponseEntity<List<QuotationResponse>> getQuotationsByRfq(@PathVariable Long rfqId) {
        List<QuotationResponse> responses = quotationService.getQuotationsByRfq(rfqId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/compare/{rfqId}")
    public ResponseEntity<List<QuotationResponse>> compareQuotations(@PathVariable Long rfqId) {
        List<QuotationResponse> responses = quotationService.compareQuotations(rfqId);
        return ResponseEntity.ok(responses);
    }
}
