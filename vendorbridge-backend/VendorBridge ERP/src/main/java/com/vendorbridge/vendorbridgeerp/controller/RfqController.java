package com.vendorbridge.vendorbridgeerp.controller;

import com.vendorbridge.vendorbridgeerp.dto.request.RfqRequest;
import com.vendorbridge.vendorbridgeerp.dto.request.AssignVendorRequest;
import com.vendorbridge.vendorbridgeerp.dto.request.RfqAttachmentRequest;
import com.vendorbridge.vendorbridgeerp.dto.response.RfqResponse;
import com.vendorbridge.vendorbridgeerp.service.RfqService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rfqs")
@RequiredArgsConstructor
public class RfqController {

    private final RfqService rfqService;

    @PostMapping
    public ResponseEntity<RfqResponse> createRfq(@RequestBody RfqRequest request) {
        RfqResponse response = rfqService.createRfq(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<RfqResponse>> getAllRfqs() {
        List<RfqResponse> rfqs = rfqService.getAllRfqs();
        return ResponseEntity.ok(rfqs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RfqResponse> getRfqById(@PathVariable Long id) {
        RfqResponse rfq = rfqService.getRfqById(id);
        return ResponseEntity.ok(rfq);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RfqResponse> updateRfq(@PathVariable Long id, @RequestBody RfqRequest request) {
        RfqResponse response = rfqService.updateRfq(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRfq(@PathVariable Long id) {
        rfqService.deleteRfq(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/assign-vendor")
    public ResponseEntity<RfqResponse> assignVendor(@PathVariable Long id, @RequestBody AssignVendorRequest request) {
        RfqResponse response = rfqService.assignVendor(id, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/upload")
    public ResponseEntity<RfqResponse> addAttachment(@PathVariable Long id, @RequestBody RfqAttachmentRequest request) {
        RfqResponse response = rfqService.addAttachment(id, request);
        return ResponseEntity.ok(response);
    }
}
